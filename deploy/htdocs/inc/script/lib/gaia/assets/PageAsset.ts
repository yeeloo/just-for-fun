import refdef = require('lib/ReferenceDefinitions');

import Gaia = require('lib/gaia/api/Gaia');
import gEvents = require('lib/gaia/events/GaiaEvents');

import IPageAsset = require('lib/gaia/interface/IPageAsset');
import IRoute = require('lib/gaia/interface/IRoute');
import IPageNode = require('lib/gaia/interface/IPageNode');
import IPageController = require('lib/gaia/interface/IPageController');
import IPageViewModel = require('lib/gaia/interface/IPageViewModel');

import utils = require('lib/temple/utils/Utils');
import EventDispatcher = require('lib/temple/events/EventDispatcher');
import BaseEvent = require('lib/temple/events/BaseEvent');

import ko = require('knockout');

/**
 * PageAsset
 *
 * @module Gaia
 * @namespace gaia.assets
 * @class PageAsset
 * @extend temple.events.EventDispatcher
 */
class PageAsset extends EventDispatcher implements IPageAsset
{
	public static viewModelPath:string = 'app/page/';
	public static controllerPath:string = 'app/page/';
	public static templatePath:string = 'app/../../template/'; // relative to this file

	public static viewModelMobilePath:string = 'mobile/page/';
	public static controllerMobilePath:string = 'mobile/page/';
	public static templateMobilePath:string = 'app/../../template/mobile/'; // relative to this file

	private _debug:boolean = false;

	private _parent:PageAsset;
	public defaultChild:string;
	public landing:boolean;
	public active:boolean;

	private  _node:IPageNode;
	public id:string;
	public title:string;
	public route:string;
	public container:string;
	public controllerName:string;
	public viewModelName:string;
	public template:string;
	public type:string;
	public data:any;
	public partials:{
		app?: string[];
		mobile?: string[];
	};

	public pages:{
		[index: string]: PageAsset;
	};
	public assets:{
		[index: string]: PageAsset;
	};

	public isTransitionedIn:boolean;

	private _controller:IPageController;

	_onProgressDelegate:(event:BaseEvent, data?:any) => any;
	_onCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onErrorDelegate:(event:BaseEvent, data?:any) => any;

	_onGaiaHistoryDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionInCompleteDelegate:(event:BaseEvent, data?:any) => any;
	_onTransitionOutCompleteDelegate:(event:BaseEvent, data?:any) => any;

	constructor(node:IPageNode)
	{
		super();

		this._node = node;

		// net data by node
		this.id = node.id;
		var defaultFile = this.id + '/' + this.id.charAt(0).toUpperCase() + this.id.replace(/\-[a-z0-9]/g,function (x)
		{
			return x.charAt(1).toUpperCase();
		}).substr(1);

		var folder = (this._node.folder || '');

		this.title = node.title || node.id;
		this.data = node.data || {};
		this.container = node.container;
		this.partials = node.partials || {};

		// get paths
		this.template = this.getFileValue(node.template, PageAsset.templatePath, PageAsset.templateMobilePath, folder, 'default.html', this.id, false, '.html');
		this.controllerName = this.getFileValue(node.controller, PageAsset.controllerPath, PageAsset.controllerMobilePath, folder, 'CustomAbstractController', defaultFile + 'Controller');
		this.viewModelName = this.getFileValue(node.viewModel, PageAsset.viewModelPath, PageAsset.viewModelMobilePath, folder, 'DefaultViewModel', defaultFile + 'ViewModel');

		// default landing = false.
		if (typeof node.landing == 'undefined')
		{
			this.landing = false;
		}
		else
		{
			this.landing = node.landing;
		}

		this.pages = {};
		this.assets = {};
	}

	private getFileValue(value:any, path:string, pathMobile:string, folder:string, defaultFile:string, autoFile:string, isMobileValue:boolean = false, fileExtension:string = ''):string
	{
//		console.log('getFileValue: ', arguments);

		if (typeof value === 'object')
		{
			return this.getFileValue((isMobile ? value.mobile : value.app), path, pathMobile, folder, defaultFile, autoFile, isMobile, fileExtension);
		}
		// mobile, create both using convention
		else if (value == 'mobile')
		{
			return (isMobile ? pathMobile : path) + folder + autoFile + fileExtension;
		}
		// missing, create using convention
		else if (typeof value === 'undefined')
		{
			return (isMobileValue ? pathMobile : path) + folder + autoFile + fileExtension;
		}
		// if not default, create the path specified
		else if (value != 'default')
		{
			return (isMobileValue ? pathMobile : path) + folder + value;
		}
		else if (value == 'default')
		{
			return (isMobileValue ? pathMobile : path) + defaultFile;
		}

		return '';
	}

	init():void
	{
		this._onGaiaHistoryDelegate = <(event:BaseEvent, data?:any) => any>this.onDeeplink.bind(this);
		this._onTransitionCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionComplete.bind(this);
		this._onTransitionInCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionInComplete.bind(this);
		this._onTransitionOutCompleteDelegate = <(event:BaseEvent, data?:any) => any>this.onTransitionOutComplete.bind(this);
	}

	getBranch():string
	{
		if (this._parent != null)
		{
			return this._parent.getBranch() + "/" + this.id;
		}
		return this.id;
	}

	getContent():IPageController
	{
		return this._controller;
	}

	getData(key?:string, inherit:boolean = false):any
	{
		// return complete object
		if (!key)
		{
			if (inherit && this.getParent())
			{
				return $.extend({}, this.getParent().getData(key, inherit), this.data);
			}
			else
			{
				return this.data;
			}
		}

		// if no data, check possible with parent (else return null)
		if (key && !this.data)
		{
			if (inherit && this.getParent())
			{
				return this.getParent().getData(key, inherit);
			}

			return null;
		}

		// return key
		if (key in this.data) return this.data[key];

		// return parent key
		if (inherit && this.getParent())
		{
			return this.getParent().getData(key, inherit);
		}

		return null;
	}

	public setParent(value:PageAsset):void
	{
		if (this._parent == null)
		{
			this._parent = value;
		}
	}

	public getParent():PageAsset
	{
		return this._parent;
	}

	public preload():void
	{
		this.active = true;

		var fileList = [
			this.viewModelName,
			this.controllerName
		];

		if (!ko.templates.hasOwnProperty(this.id) && !document.getElementById(this.id))
		{
			fileList.push('text!' + this.template);
		}

		var partialIds:string[] = [];
		var partials = this.partials[isMobile ? 'mobile' : 'app'] || [];
		for (var i = 0; i < partials.length; i++)
		{
			var partial = partials[i];
			var partialId = partial.split('/').pop().split('.').shift();
			if (!ko.templates[partialId] && !document.getElementById(partialId))
			{
				fileList.push('text!' + (this._node.template == 'mobile' && isMobile ? PageAsset.templateMobilePath : PageAsset.templatePath) + partial);
				partialIds.push(partialId);
			}
		}

		require(fileList, (viewModel:any, controller:any, template:string) =>
		{
			var classRef:string;

			// store partials
			var start = arguments['length'] - partialIds.length;
			for (var i = start; i < arguments['length']; i++)
			{
				ko.templates[partialIds[i - start]] = arguments[i];
			}

//			classRef = this.controllerName.split('/').pop();
//			controller = controller[classRef];
//
//			classRef = this.viewModelName.split('/').pop();
//			viewModel = viewModel[classRef];

			this._controller = <IPageController>(new (controller)());

			this.onComplete();

			if (template)
			{
				this._controller.setTemplate(template);
			}
			this._controller.setViewModel(<IPageViewModel>(new (viewModel)()));

			this.dispatchEvent(new gEvents.AssetEvent(gEvents.AssetEvent.ASSET_COMPLETE, this));
		});
	}

	public initPage():void
	{
		if (!this.isTransitionedIn)
		{
			this._controller.init();
		}
	}

	public transition():void
	{
		if (this._debug)
		{
			console.log('PageAsset::transition', this.id);
		}
		this._controller.transition();
	}

	public transitionIn():void
	{
		if (this._debug)
		{
			console.log('PageAsset::transitionIn', this.id);
		}
		if (!this.isTransitionedIn)
		{
			//initAssets();
			this._controller.transitionIn();
		}
		else
		{
			this.onTransitionInComplete();
		}
	}

	public transitionOut():void
	{
		if (this._debug)
		{
			console.log('PageAsset::transitionOut', this.id);
		}
		Gaia.history.removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		if (this.isTransitionedIn)
		{
			this._controller.transitionOut();
		}
		else
		{
			this.onTransitionOutComplete();
		}
	}

	// EVENT LISTENERS
	private onTransitionComplete(event:Event = null):void
	{
		if (this._debug)
		{
			console.log('PageAsset::onTransitionComplete', this.id);
		}
		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_COMPLETE));
	}

	private onTransitionInComplete(event:Event = null):void
	{
		if (this._debug)
		{
			console.log('PageAsset::onTransitionInComplete', this.id);
		}

		this.isTransitionedIn = true;
		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_IN_COMPLETE));
	}

	private onTransitionOutComplete(event:BaseEvent = null):void
	{
		if (this._debug)
		{
			console.log('PageAsset::onTransitionOutComplete', this.id);
		}

		this.destroy();

		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_OUT_COMPLETE));
	}

	onComplete():void
	{
		this.decorate();

		Gaia.history.addEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		this.isTransitionedIn = false;
		//super.onComplete(event);
		//_loader.content.visible = true;
	}

	// GaiaHistory sends deeplink events to active pages
	private onDeeplink(event:gEvents.GaiaHistoryEvent):void
	{
		this._controller.onDeeplink(event);
	}

	private decorate():void
	{
		this._controller.addEventListener(gEvents.PageEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
		this._controller.addEventListener(gEvents.PageEvent.TRANSITION_IN_COMPLETE, this._onTransitionInCompleteDelegate);
		this._controller.addEventListener(gEvents.PageEvent.TRANSITION_OUT_COMPLETE, this._onTransitionOutCompleteDelegate);
		this._controller.page = this;
	}

	public destroy():void
	{
		this.isTransitionedIn = false;

		if (this._controller)
		{
			this._controller.destruct();
			this._controller = null;
		}

		Gaia.history.removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);

		this.active = false;
	}
}

export = PageAsset;