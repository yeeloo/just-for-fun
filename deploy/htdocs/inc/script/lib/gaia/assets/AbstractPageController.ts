import utils = require('lib/temple/utils/Utils');
import EventDispatcher = require('lib/temple/events/EventDispatcher');
import IDestructible = require("lib/temple/core/IDestructible");

import IPageAsset = require('lib/gaia/interface/IPageAsset');
import IPageViewModel = require('lib/gaia/interface/IPageViewModel');
import IPageController = require('lib/gaia/interface/IPageController');
import gEvents = require('lib/gaia/events/GaiaEvents');
import Gaia = require('lib/gaia/api/Gaia');

import IComponentController = require('lib/temple/component/IComponentController');
import ko = require('knockout');

/**
 * AbstractPageController
 *
 * @module Gaia
 * @namespace gaia.assets
 * @class AbstractPageController
 * @extends temple.events.EventDispatcher
 */
class AbstractPageController extends EventDispatcher implements IPageController
{
	/**
	 * reference to viewmodel, redeclare in page to correct type
	 *
	 * @property viewModel
	 */
	public viewModel:IPageViewModel;

	/**
	 * reference to the page-div in the DOM, use this for element lookups
	 *
	 * @property element
	 */
	element:HTMLDivElement;

	/**
	 * reference to the PageAsset (where you can find all info like id, route, title, etc.)
	 *
	 * @property page
	 */
	page:IPageAsset;

	/**
	 * autotransitions rock, set to false if you want to do your own
	 *
	 * @property _autoTransition
	 */
	_autoTransition:boolean = true;

	/**
	 * list of registered components, used for destruction
	 *
	 * @property _components
	 * @protected
	 */
	public _components:Array<IComponentController> = [];

	// list of Knockout subscriptions, used for destruction
	/**
	 * list of registered components, used for destruction
	 *
	 * @property _subscriptions
	 * @protected
	 */
	public _subscriptions:Array<KnockoutSubscription> = [];

	// list of destructables, like Event handlers, used for destruction
	/**
	 * list of registered components, used for destruction
	 *
	 * @property _destructibles
	 * @protected
	 */
	public _destructibles:Array<IDestructible> = [];

	/**
	 * Debug flag
	 *
	 * @property _debug
	 * @type boolean
	 * @private
	 */
	private _debug = false;

	/**
	 * Constructor
	 *
	 * @constructor
	 */
	constructor()
	{
		super();
	}

	/**
	 * save viewmodel reference, and add a refence back to this page on the viewModel
	 *
	 * @method setViewModel
	 * @param {IViewModel} viewModel
	 * @return {void}
	 */
	public setViewModel(viewModel:IPageViewModel):void
	{
		this.viewModel = viewModel;
		this.viewModel.setController(this);
	}

	/**
	 * set the template, so it can be used for KnockOut
	 *
	 * @method setTemplate
	 * @param {string} template
	 * @return {void}
	 */
	public setTemplate(template:string):void
	{
		ko.templates[this.page.id] = template;
	}

	/**
	 * always call super.init() when you override this method, or else we don't have a ViewController
	 *
	 * @method init
	 * @return {void}
	 */
	public init():void
	{
		// find container to inser this page in
		var container:HTMLDivElement;
		var page = this.page;
		while (page.getParent() && !container)
		{
			// todo, add support for named containers: "[data-gaia-container=" + container + "]"
			var el = page.getParent().getContent().element;
			if (this.page.container)
			{
				container = <HTMLDivElement>$('[data-gaia-container="' + this.page.container + '"]', el)[0];
			}
			else
			{
				container = <HTMLDivElement>$('[data-gaia-container]', el)[0];
			}
			page = page.getParent();
		}

		// we need a container div for our page
		container = container || <HTMLDivElement>$('[data-gaia-container=' + this.page.container + ']')[0] || <HTMLDivElement>$('[data-gaia-container=main]')[0] || <HTMLDivElement>$('[data-gaia-container]')[0];
		var holder:HTMLDivElement = <HTMLDivElement>document.createElement('div');

		// the template will be loded in this page via data-binding
		$(holder).attr('data-bind', "template: { name: '" + this.page.id + "' }");

		// we need this css-class for our styles
		$(holder).addClass('view view-' + this.page.id.replace(/\./g, '-'));

		// and add it
		container.appendChild(holder);

		// do the KnockOut magic
		ko.applyBindings(this.viewModel, holder);

		// save the refence
		this.element = holder;

		$(this.element).find('[data-gaia-container]').each((index, item) =>
		{
			if ($(item).attr('data-gaia-container') == '')
			{
				$(item).attr('data-gaia-container', this.page.id);
			}
		});

		// hide it for now, we will show it later in the TransitionManager
		this.element.style.visibility = 'hidden';
	}

	transition():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transition', this.page.id);
		}

		this.transitionComplete();
	}

	transitionIn():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionIn', this.page.id);
		}

		this.element.style.visibility = 'visible';

		this.transitionInComplete();
	}

	transitionOut()
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionOut', this.page.id);
		}

		this.element.style.visibility = 'visible';

		this.transitionOutComplete();
	}

	transitionComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionComplete', this.page.id);
		}
		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_COMPLETE));
	}

	transitionInComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionComplete', this.page.id);
		}
		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_IN_COMPLETE));
	}

	transitionOutComplete():void
	{
		if (this._debug)
		{
			console.log('AbstractController::transitionOutComplete', this.page.id);
		}
		this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_OUT_COMPLETE));
	}

	onDeeplink(event:gEvents.GaiaHistoryEvent):void
	{
	}

    registerComponent(component:IComponentController):void
    {
        this._components.push(component);
    }

	public destruct():void
	{
		$(this.element).off('.remove');

		if (this.viewModel)
		{
			if (typeof this.viewModel.destruct !== "undefined")
			{
				this.viewModel.destruct();
			}
			this.viewModel = null;
		}
		this.page = null;

		$(this.element).remove();
		this.element = null;

		if (this._components)
		{
			while (this._components.length) this._components.shift().destruct();
			this._components = null;
		}
		if (this._subscriptions)
		{
			while (this._subscriptions.length) this._subscriptions.shift().dispose();
			this._subscriptions = null;
		}
		if (this._destructibles)
		{
			while (this._destructibles.length)
			{
				this._destructibles.shift().destruct();
			}
			this._destructibles = null;
		}

		super.destruct();
	}
}

export = AbstractPageController;