import Gaia = require('lib/gaia/api/Gaia');
import BranchTools = require('lib/gaia/core/BranchTools');
import SiteModel = require('lib/gaia/core/SiteModel');
import gEvents = require('lib/gaia/events/GaiaEvents');

import EventDispatcher = require('lib/temple/events/EventDispatcher');
import BaseEvent = require('lib/temple/events/BaseEvent');
import utils = require('lib/temple/utils/Utils');
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');


// todo: do replaceState instead of pushState on startup so you can go back out of you site

/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaHistory
 * @extend temple.events.EventDispatcher
 */
class GaiaHistory extends EventDispatcher
{
	private static _instance:GaiaHistory;

	private _debug:boolean = false && DEBUG;
	private _deeplink:{[param:string]:any} = {};
	private _base:string;
	private _locale:string = null;
	private _enabled:boolean;

	private _localValue:string = '';
	private isInternal:boolean;
	private _queryString:string;

	// match /az_AZ/foo
	// match /az_AZ
	private _localeRegex:RegExp = /^[\/]?(([a-z]{2}_[A-Z]{2})|([a-z]{2}))(\/|$)/gi;

	private rootBranch:string;
	public isSinglePage:boolean;

	private lastValidBranch:string;

	private _history:IRouteResultItem[];
	private _historyPointer:number;
	
	//private indexFirstEvent: SWFAddressEvent;

	constructor()
	{
		super();
	}

	public static getInstance():GaiaHistory
	{
		if (GaiaHistory._instance == null)
		{
			GaiaHistory._instance = new GaiaHistory();
		}

		window['GaiaHistory'] = GaiaHistory;

		return GaiaHistory._instance;
	}

	public birth(s:string = ''):void
	{
		this._base = $('meta[name=document-base]').attr('content');

		// not defined, set root of domain
		if (typeof this._base === 'undefined')
		{
			this._base = document.location.protocol + '//' + document.location.host + '/';
		}
		// set, but host not in value, use as relative
		else if (this._base.indexOf(document.location.host) == -1)
		{
			this._base = document.location.protocol + '//' + document.location.host + (this._base.charAt(0) == '/' ? '' : '/') + this._base;
		}

		this._history = [];
		this._historyPointer = 0;

		this._enabled = typeof this._base !== 'undefined';

		if (this._enabled)
		{
			// force trailing /
			if (this._base.split('').pop() != '/')
			{
				this._base += '/';
			}

			// get path for emulated redirect
			history['redirect'] && history['redirect']('/', this._base.replace(document.location.protocol + '//' + document.location.host, ''));
		}

		this.rootBranch = s;
	}

	public getHistory():IRouteResultItem[]
	{
		return this._history;
	}

	public getHistoryPointer():number
	{
		return this._historyPointer;
	}

	public getDeeplink():{[param:string]:any}
	{
		return this._deeplink;
	}

	public getLocale():string
	{
		return this._locale;
	}

	public setLocale(locale:string)
	{
		this._locale = locale;

		this.setHistoryValue(this.getHistoryValue(true));
	}

//	public getValue():string
//	{
//		var v:string = this.getHistoryValue();
//		if (v == "/" && this.rootBranch && this.rootBranch.length > 0)
//		{
//			var validBranch:string = BranchTools.getValidBranch(this.rootBranch);
//			this._deeplink = this.rootBranch.substring(validBranch.length, this.rootBranch.length);
//			return "/" + Gaia.api.getPage(validBranch).route.base + this._deeplink;
//		}
//		return v;
//	}

	public init(beforeStart:(route:string, validBranch:string, deeplink:{[param:string]:any}) => string = null):void
	{
		if (!SiteModel.getIndexFirst())
		{
			$(window).on("popstate", (e) =>
			{
				this.onChange();
			});

			// get history to parse locale
			var localValue = this.getHistoryValue(false, true);
			var startRoute = localValue;

			var routeResult:IRouteResultItem = Gaia.router.resolvePage(startRoute, true, true);

			// let the user change the value
			if (beforeStart)
			{
				startRoute = beforeStart(routeResult.route, routeResult[0].branch, routeResult[0].deeplink);
			}

			// start should always be absolute, so force starting /
			if (startRoute.charAt(0) != '/')
			{
				startRoute = '/' + startRoute;
			}

			if (this._debug) console.log(startRoute, Gaia.router.resolvePage(startRoute, true, true));

			var startRouteResult:IRouteResultItem = Gaia.router.resolvePage(startRoute, true, true);
			startRoute = startRouteResult.route;

			// set forced deeplink
//			var historyValue = this.stripStrictSlashes(startRoute);
//			var validBranch:string = this.parseDeeplink(historyValue);
//			var pageDeeplinkEnabled = !Gaia.api.getPage(validBranch).route.deeplinkDisabled;

			// if deeplink not allowed, redirect to start
			if (!startRouteResult)
			{
//				this.setHistoryValue('/', true);
			}
			else
			{
				// if deeplink is different from current value
				if (startRoute != localValue) // startRoute != '/' &&
				{
					this.setHistoryValue(startRoute, true);
				}
			}
		}

		this.onChange();
	}

	public onGoto(event:gEvents.GaiaEvent):void
	{
		if (this._debug) console.log('onGoto: ', event);
		if (!event.external)
		{
			this.isInternal = true;

//			if (!this.isSinglePage && BranchTools.getPage(event.validBranch).route.disabled)
//			{
//				this.setHistoryValue(this.getHistoryValue());
//				this.isInternal = false;
//				return;
//			}

			this._deeplink = event.routeResult[0].deeplink;
			this.lastValidBranch = event.routeResult[0].branch;

			// new url
			var newRoute = event.routeResult.route || Gaia.router.assemble(event.routeResult[0].branch, event.routeResult[0].deeplink);

			if (newRoute)
			{
				// current url
				var urlValue = this.getHistoryValue();

				if (this._debug) console.log('onGoto: ', urlValue, newRoute);
				// did the url change?
				if (newRoute != urlValue)
				{
					// and are we not dealing with an alias
					var currentBranchResult:IRouteResultItem = Gaia.router.resolvePage(urlValue);
					if (!currentBranchResult.equals(event.routeResult))
					{
						// set new url
						this.setHistoryValue(newRoute, event.replace);
						this.onChange();
					}
				}
			}

			// for normal browsers, isInternal can be set to false here
			// but in IE the change listener is async, so we get issues
			// but I let it here because it might give other issues
			this.isInternal = false;

			var title:string = SiteModel.getTitle().replace('{page}', Gaia.api.getPage(event.routeResult[0].branch).title);
			document.title = title;
		}
	}

	private onChange(fromLocal:boolean = false):void
	{

		var historyValue = this.getHistoryValue();
//		historyValue = this.stripStrictSlashes(historyValue);
//		var validBranch:string = this.parseDeeplink(historyValue);
//		var validRoute = historyValue.substr(0, historyValue.length - this._deeplink.length);

		var routeResult:IRouteResultItem = Gaia.router.resolvePage(historyValue, true);

		if (!fromLocal)
		{
			// we were in the middle
			if (this._historyPointer != 0)
			{
				// kill the 'forward' pages, because we create a new future
				this._history.splice(0, this._historyPointer);
				this._historyPointer = 0;
			}

			this._history.unshift(routeResult);
		}

		if (!this.isInternal)
		{
			this.dispatchGoto(routeResult);


//			if (historyValue.length > 1)
//			{
//				if (SiteModel.getRouting())
//				{
//					if (validBranch.length > 0)
//					{
//						this.dispatchGoto(validBranch + this._deeplink, validRoute);
//					}
//					else if (this.isSinglePage)
//					{
//						this.dispatchGoto(SiteModel.getIndexID() + this._deeplink);
//					}
//					else
//					{
//						this.dispatchGoto(SiteModel.getIndexID());
//					}
//				}
//				else
//				{
//					var validated:string = this.validate(historyValue);
//					this.dispatchGoto(validated);
//				}
//			}
//			else
//			{
//				if (this.rootBranch && this.rootBranch.length > 0)
//				{
//					this.dispatchGoto(this.rootBranch);
//					this.rootBranch = null;
//				}
//				else
//				{
//					this.dispatchGoto(SiteModel.getIndexID());
//				}
//			}
		}
		this.dispatchDeeplink(routeResult);

		// this is set here for IE
		//this.isInternal = false;
	}

	private getHistoryValue(skipLocale:boolean = false, ignoreEnabledState:boolean = false):string
	{
		if (!this._enabled && !ignoreEnabledState)
		{
			return this._localValue;
		}

		// fix for weird IE version
		var location = (history['location'] || document.location).href || document.location.href;

		this._queryString = location.indexOf('?') != -1 ? location.split('?').pop() : '';

		// force trailing /
		if (location.split('').pop() != '/')
		{
			location += '/';
		}

		/**
		 * NOTE: IE* fix disabled because this will break deeplinking to the root
		// fix IE8 missing deeplink issue
		if (location == this._base)
		{
			location = this.getFixedDocumentLocation();
		}

		if (location == document.location.protocol + '//' + document.location.host + '/')
		{
			location = this.getFixedDocumentLocation();
		}
		 */

		// prevent future errors
		if (location == undefined || location == null)
		{
			location = '';
		}

		// strip basepath, leave deeplink
		if (location.indexOf(this._base) == 0)
		{
			location = location.replace(this._base, '')
		}

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}
		// remove trailing /
		if (location.split('').pop() == '/')
		{
			location = location.substr(0, location.length - 1);
		}

		// decode URL
		location = decodeURIComponent(location);

		// locale hook
		if (!skipLocale)
		{
			var locale = this._localeRegex.exec(location);

			if (locale)
			{
				this._locale = locale[1];
			}
		}

		location = location.replace(this._localeRegex, '');
		// end locale hook

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}

		return location;
	}

	private getFixedDocumentLocation():string
	{
		var location = document.location.href;

		// force trailing /
		if (location.split('').pop() != '/')
		{
			location += '/';
		}

		return location;
	}

	private setHistoryValue(value:string, replace:boolean = false):void
	{
		if (!this._enabled)
		{
			this._localValue = value;
			return;
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// chrome
			if (!history['emulate'])
			{
				value = value.substr(1);
			}
		}
		else
		{
			// chrome
			if (!history['emulate'])
			{
				value = (this.getHistoryValue(true).replace(/[^\/]+$/g, '') + value).substr(1);
			}
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// locale hook
			value = (this._locale ? '/' + this._locale : '') + value;
		}
		// relative
		else
		{
			// locale hook
			value = (this._locale ? this._locale + '/' : '') + value;
		}

		if (this._queryString.length > 0)
		{
			value += '?' + this._queryString;
		}

		if (!history['emulate'])
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, this._base + (value.charAt(0) == '/' ? value.substr(0) : value));
		}
		else
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, value);
		}
	}

	private dispatchGoto(routeResult:IRouteResultItem):void
	{
		this.dispatchEvent(new gEvents.GaiaHistoryEvent(gEvents.GaiaHistoryEvent.GOTO, routeResult));
	}

	private dispatchDeeplink(routeResult:IRouteResultItem):void
	{
		this.dispatchEvent(new gEvents.GaiaHistoryEvent(gEvents.GaiaHistoryEvent.DEEPLINK, routeResult));
	}

//	private parseDeeplink(value:string):string
//	{
//		var validated:string = this.validate(value);
//		var validBranch:string = SiteModel.getRouting() ? SiteModel.getRoutes()[validated] || "" : "";
//
//		this._deeplink = value.substring(validated.length, value.length);
//
//		if ((this.isSinglePage || validated.length == 0) && this._deeplink.length > 0)
//		{
//			this._deeplink = "/" + this._deeplink;
//		}
//		return validBranch;
//	}

//	private validate(str:string):string
//	{
//		var val:string = this.stripStrictSlashes(str);
//		if (SiteModel.getRouting())
//		{
//			return BranchTools.getValidRoute(val);
//		}
//		else
//		{
//			return BranchTools.getFullBranch(val).split("/").slice(1).join("/");
//		}
//	}

//	private stripStrictSlashes(str:string = null):string
//	{
//		if (str == null || str.length == 0)
//		{
//			return "";
//		}
//		if (str.charAt(0) == "/")
//		{
//			str = str.substr(1);
//		}
//		if (str.charAt(str.length - 1) == "/")
//		{
//			str = str.substr(0, str.length - 1);
//		}
//		return str;
//	}
//
//	private insertStrictSlashes(str:string = null):string
//	{
//		if (str == null || str.length == 0)
//		{
//			return "/";
//		}
//		if (str.charAt(0) != "/")
//		{
//			str = "/" + str;
//		}
//		return str;
//	}

	public back():void
	{
		if (this._enabled)
		{
			history.back();
		}
		else
		{
			++this._historyPointer;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));

			this._internalChange();
		}
	}

	public forward():void
	{
		if (this._enabled)
		{
			history.forward();
		}
		else
		{
			--this._historyPointer;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));

			this._internalChange();
		}
	}

	public _internalChange()
	{
		// get validBranch from history
		var val = this._history[this._historyPointer];
		var validBranch = BranchTools.getValidBranch(val[0].branch);

		// convert validBranch to route
		if (validBranch.length > 0)
		{
			// todo
//			this._deeplink = val.substring(validBranch.length);
//			this._localValue = Gaia.api.getPage(validBranch).route.base + this._deeplink;

			// do as if the url has changed
			this.onChange(true);
		}
	}

	public jump(steps:number):void
	{
		if (this._enabled)
		{
			history.go(steps);
		}
		else
		{
			this._historyPointer -= steps;
			this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));
		}
	}
}

export = GaiaHistory;