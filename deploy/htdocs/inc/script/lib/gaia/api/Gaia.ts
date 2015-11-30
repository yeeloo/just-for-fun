import GaiaHQ = require('lib/gaia/core/GaiaHQ');
import GaiaHistory = require('lib/gaia/core/GaiaHistory');
import GaiaRouter = require('lib/gaia/router/GaiaRouter');
import SiteModel = require('lib/gaia/core/SiteModel');
import SiteController = require('lib/gaia/core/SiteController');
import IPageAsset = require('lib/gaia/interface/IPageAsset');
import BranchTools = require('lib/gaia/core/BranchTools');
import gEvents = require('lib/gaia/events/GaiaEvents');

import IRoute = require('lib/gaia/interface/IRoute')
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');

export interface IGaia
{
	goto(branch:string, deeplink?:{[param:string]: any;}, replace?:boolean):void;

	// data-gaia-goto-route
	gotoRoute(route:string):void;

	// data-gaia-goto-popup
	gotoPopup(popupId:string, deeplink?:{[param:string]:any}):void;
	closePopup(): void;

	getCurrentBranch(): string;
	getCurrentRoute(): string;
	getDeeplink(): {[param:string]:any};
	getParam(key?:string, route?:IRoute, deeplink?:string):any;
	getQueryParam(key:string):string;
	getValidBranch(branch:string): string;
	getPage(branch:string): IPageAsset;
	getDepthContainer(name:string): HTMLDivElement;

	// data-gaia-back
	back(): void;
	// data-gaia-forward
	forward(): void;
	// data-gaia-jump
	jump(steps:number): void;

	beforeGoto(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterGoto(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransitionOut(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransitionOut(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransition(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransition(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	beforeTransitionIn(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterTransitionIn(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;
	afterComplete(target:(event:gEvents.GaiaEvent) => any, hijack?:boolean, onlyOnce?:boolean): (removeHijack?:boolean) => void;

	removeBeforeGoto(target:(event:gEvents.GaiaEvent) => any): void;
	removeAfterGoto(target:(event:gEvents.GaiaEvent) => any): void;
	removeBeforeTransitionOut(target:(event:gEvents.GaiaEvent) => any): void;
	removeAfterTransitionOut(target:(event:gEvents.GaiaEvent) => any): void;
	removeBeforeTransition(target:(event:gEvents.GaiaEvent) => any): void;
	removeAfterTransition(target:(event:gEvents.GaiaEvent) => any): void;
	removeBeforeTransitionIn(target:(event:gEvents.GaiaEvent) => any): void;
	removeAfterTransitionIn(target:(event:gEvents.GaiaEvent) => any): void;
	removeAfterComplete(target:(event:gEvents.GaiaEvent) => any): void;

	addDeeplinkListener(target:(event:gEvents.GaiaEvent) => any): void;
	removeDeeplinkListener(target:(event:gEvents.GaiaEvent) => any): void;

	isReady():boolean;
}

/**
 * GaiaJS is an JavaScript Framework designed to dramatically reduce development time.
 * It provides solutions to the challenges and repeated tasks we all face with front-end development, such as navigation, transitions, preloading, site structure and deep linking.
 * It provides speed and flexibility in your workflow and a simple API that gives you access to its powerful features.
 *
 *  Sitemap
 *  --------
 * 	define({
 * 		"title": "Gaia - {page}",
 * 		"config": {
 * 		    "controllerPath": "app/page/",
 * 		    "viewModelPath": "app/page/",
 * 		    "templatePath": "../../../../template/"
 * 		},
 * 		"routes": [
 * 		],
 * 		"pages": [
 * 		    {
 * 		        "id": "index",
 * 		        "title": "index",
 * 		        "pages": [
 * 		            {
 * 		                "id": "home",
 * 		                "title": "Home"
 * 		            }
 * 		        ]
 * 		    }
 * 		],
 * 		"popups": [
 * 		    {
 * 		        "id": "popup1",
 * 		        "title": "popup1"
 * 		    }
 * 		]
 * 	});
 *
 * @module Gaia
 */

/**
 * @namespace gaia.api
 * @class GaiaImpl
 */
export class GaiaImpl implements IGaia
{
	constructor()
	{

	}

	/**
	 * goto is the primary method you will be using in Gaia. It requires at least one argument and that is a string of the branch you want to navigate to.
	 *
	 * It has support for absolute paths, starting with a `/`, or relative paths. You can also use `./` or `../` to go a level up.<br>
	 * The starting `/` is optional<br>
	 * Starting with a `.` makes it relative<br>
	 *
	 * Starting with `index/home/detail`
	 *
	 *	index/foo        >> index/foo
	 *	/index/foo       >> index/foo
	 *	.                >> index/home/detail
	 *	./foo            >> index/home/detail/foo
	 *	..               >> index/home
	 *	../foo           >> index/home/foo
	 *
	 * __Note:__<br>
	 * If you are doing a goto to a sub- or parent-page and want to keep url-parameters of your current/parent page in tact, you should use
	 *
	 *	$.extend({}, Gaia.api.getDeeplink(), {foo: bar})
	 *
	 * to merge the current and new deeplink together and pass them as the deeplink parameter.
	 *
	 * @method goto
	 * @param {string} branch
	 * @param {HashMap} [deeplink]
	 * @param {boolean} [replace=false]
	 */
	public goto(branch:string, deeplink?:{[param:string]: any;}, replace:boolean = false):void
	{
		if (!branch) throw new Error("branch can not be empty");

		var branch = BranchTools.resolveBranch(branch, this.getCurrentBranch());

		GaiaHQ.getInstance().goto(branch, deeplink, null, null, replace);
	}

	/**
	 * Opens a new page by providing the route.
	 *
	 * @method gotoRoute
	 * @param {string} route
	 */
	public gotoRoute(route:string):void
	{
		// add accidental missing starting /
		if (route.charAt(0) != '/')
		{
			route = route + '/';
		}

		// transform route into branch
		var branch:IRouteResultItem = router.resolvePage(route, true);

		if (branch)
		{
			GaiaHQ.getInstance().goto(branch[0].branch, branch[0].deeplink, null, null, false, route);
		}
		else
		{
			console.error('invalid route: ', route);
			GaiaHQ.getInstance().goto("index");
		}
	}

	/**
	 * Navigates to a popup relative from the current base-branch.<br>
	 * Popups are normal pages that are dynamically appended as subpages to all other pages.<br>
	 * You navigate to popups using the branch-path of only the popup.<br>
	 * So if you are on /index/home, and you want to open the about popup you do:
	 *
	 *	Gaia.api.gotoPopup('about');
	 *
	 * If you have a popup-wrapper named 'popup' the goto will be:
	 *
	 *	Gaia.api.gotoPopup('popup/about');
	 *
	 * Opening a new popup will automatically close other opened popups.
	 *
	 * Because opening a popup is almost always a sub-page (except when closing a current one),
	 * it will automatically merge the passed deeplink over the current deeplink, keeping it in tact.
	 *
	 * @method gotoPopup
	 * @param {string} popupId the 'branch-path' of the popup part of the branch, will be appended to the current branch
	 * @param {HashMap} [deeplink]
	 */
	public gotoPopup(popupId:string, deeplink?:{[param:string]:any}):void
	{
		var branch = BranchTools.getPopupBranch(popupId, this.getCurrentBranch());

		// merge new deeplink over current one
		deeplink = $.extend({}, this.getDeeplink(), deeplink);

		this.goto(branch, deeplink);
	}

	/**
	 * Closes the currently opened popup.
	 * It will also automatically keep the current deeplink, alowing the parent page to keep working.
	 *
	 * @method closePopup
	 */
	public closePopup():void
	{
		this.gotoPopup(null, this.getDeeplink());
	}

	/**
	 * Returns the current branch.
	 *
	 * @method getCurrentBranch
	 * @returns {string}
	 */
	public getCurrentBranch():string
	{
		return SiteController.getCurrentBranch();
	}

	/**
	 * Returns the current route.
	 *
	 * @method getCurrentRoute
	 * @returns {string}
	 */
	public getCurrentRoute():string
	{
		return SiteController.getCurrentRoute();
	}

	/**
	 * Returns the current deeplink.
	 *
	 * The deeplink is an object filled with all the deeplink parameters.<br>
	 * To get an individual parameter you can use {{#crossLink "gaia.api.GaiaImpl/getParam:method"}}{{/crossLink}}
	 *
	 * @method getDeeplink
	 * @returns {HashMap}
	 */
	public getDeeplink():{[param:string]:any}
	{
		return GaiaHistory.getInstance().getDeeplink();
	}

	/**
	 * Returns a single deeplink param.
	 *
	 * @method getParam
	 * @param {string} [key]
	 * @returns {*}
	 */
	public getParam(key:string = null):any
	{
		var dl = this.getDeeplink();

		if (dl == null || key == null)
		{
			return dl;
		}

		if (dl.hasOwnProperty(key))
		{
			return dl[key];
		}
		else
		{
			return null;
		}

	}

	/**
	 * Returns a query parameter, the part after the `?`
	 *
	 * @method getQueryParam
	 * @param {string} key
	 * @returns {string}
	 */
	public getQueryParam(key:string):string
	{
		return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

	/**
	 * Returns the valid branch from the input, stripping off all invalid parts of the link at the end.
	 *
	 * @method getValidBranch
	 * @param {string} branch
	 * @returns {string}
	 */
	public getValidBranch(branch:string):string
	{
		return BranchTools.getValidBranch(branch);
	}

	/**
	 * Returns the PageAsset from the given branch, giving access to data from the GaiaSitemap and the page Controller.
	 *
	 * @method getPage
	 * @param {string} branch
	 * @returns {IPageAsset}
	 */
	public getPage(branch:string):IPageAsset
	{
		return BranchTools.getPage(branch);
	}

	public getDepthContainer(name:string):HTMLDivElement
	{
		return null;
	}

	/**
	 * Goes back to the previous page, either by using the Browsers history, or checking internally.
	 * @method back
	 */
	public back():void
	{
		GaiaHistory.getInstance().back();
	}


	/**
	 * Goes forward to the next page, either by using the Browsers history, or checking internally.
	 * @method forward
	 */
	public forward():void
	{
		GaiaHistory.getInstance().forward();
	}


	/**
	 * Jumps x steps in the history, either by using the Browsers history, or checking internally.
	 * @method jump
	 */
	public jump(steps:number):void
	{
		GaiaHistory.getInstance().jump(steps);
	}

	// goto
	public beforeGoto(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_GOTO, target, hijack, onlyOnce);
	}

	public afterGoto(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_GOTO, target, hijack, onlyOnce);
	}

	// out
	public beforeTransitionOut(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT, target, hijack, onlyOnce);
	}

	public afterTransitionOut(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION_OUT, target, hijack, onlyOnce);
	}

	// in
	public beforeTransitionIn(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION_IN, target, hijack, onlyOnce);
	}

	public afterTransitionIn(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION_IN, target, hijack, onlyOnce);
	}

	// trans
	public beforeTransition(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION, target, hijack, onlyOnce);
	}

	public afterTransition(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION, target, hijack, onlyOnce);
	}

	// complete
	public afterComplete(target:(event:gEvents.GaiaEvent) => any, hijack:boolean = false, onlyOnce:boolean = false):(removeHijack?:boolean) => void
	{
		return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_COMPLETE, target, hijack, onlyOnce);
	}


	// goto
	public removeBeforeGoto(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_GOTO, target);
	}

	public removeAfterGoto(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_GOTO, target);
	}

	// out
	public removeBeforeTransitionOut(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT, target);
	}

	public removeAfterTransitionOut(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION_OUT, target);
	}

	// in
	public removeBeforeTransitionIn(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION_IN, target);
	}

	public removeAfterTransitionIn(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION_IN, target);
	}

	// trans
	public removeBeforeTransition(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION, target);
	}

	public removeAfterTransition(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION, target);
	}

	// complete
	public removeAfterComplete(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_COMPLETE, target);
	}


	public addDeeplinkListener(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHistory.getInstance().addEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, target);
	}

	public removeDeeplinkListener(target:(event:gEvents.GaiaEvent) => any):void
	{
		GaiaHistory.getInstance().removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, target);
	}

	/**
	 * Check of Gaia is ready.
	 *
	 * @method isReady
	 * @returns {boolean}
	 */
	public isReady():boolean
	{
		return !!SiteController.getCurrentBranch();
	}
}

/**
 * @namespace gaia.api
 * @class api
 */
export var api:IGaia = new GaiaImpl();

/**
 * @namespace gaia.api
 * @class history
 * @type GaiaHistory
 */
export var history:GaiaHistory = GaiaHistory.getInstance();

/**
 * @namespace gaia.api
 * @class hq
 * @type GaiaImpl
 */
export var hq:GaiaHQ = GaiaHQ.getInstance();

/**
 * @namespace gaia.api
 * @property router
 * @type gaia.router.GaiaRouter
 */
export var router:GaiaRouter = new GaiaRouter();