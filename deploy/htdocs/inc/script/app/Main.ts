import ko = require('knockout');
import gm = require('lib/gaia/core/GaiaMain');
import gEvents = require('lib/gaia/events/GaiaEvents');
import ga = require('app/util/Analytics');
import StartUp = require('app/control/StartUp');
import Routes = require('app/config/Routes');
import Gaia = require('lib/gaia/api/Gaia');
import DataManager = require('app/data/DataManager');

/**
 * Where it all start
 *
 * @namespace app
 * @class Main
 * @extend gaia.core.GaiaMain
 */
class Main extends gm.GaiaMain
{
	/**
	 * @property _startUp
	 * @type StartUp
	 */
	public _startUp:StartUp;

	/**
	 * @property _beforeGotoHijack
	 * @type Function
	 */
	public _beforeGotoHijack:(removeHijack?:boolean) => void;

	/**
	 * @method constructor
	 * @param {app.config.GaiaSitemap} siteconfig
	 */
	constructor(siteconfig)
	{
		super();

		var routes = new Routes();
		routes.setup();

		this._startUp = new StartUp();
		this._startUp.execute(() =>
		{
			this.startGaia(siteconfig);

			this._startUp.afterGaia();
		});
	}

	/**
	 * @method onInit
	 */
	public onInit()
	{
		super.onInit((startRoute:string, validBranch:string) =>
		{
//			console.log('onInit: ', [startRoute, validBranch, Gaia.api.getCurrentBranch()]);

			// here you can change the startRoute for gaia
			// the startRoute param is the current deeplink
			// NOTE: this is the ROUTE, not the validBRANCH
			return startRoute;
		});

		window['ko'] = ko;

		// check pages for auth
		this._beforeGotoHijack = Gaia.api.beforeGoto(<(event:gEvents.GaiaEvent) => void>this.onBeforeGoto.bind(this), true);
	}

	/**
	 * @method onBeforeGoto
	 * @param {gEvents.GaiaEvent} event
	 */
	public onBeforeGoto(event:gEvents.GaiaEvent):void
	{
		var dataManager = DataManager.getInstance();
		var pageData:IPageData = Gaia.api.getPage(event.routeResult[0].branch).data || {};

		var isAuthenticated = true;

		// check if we are on a user page, but are not loggedin
		// this could happen when going to a deeplink or using the browsers back button
		if (pageData.hasOwnProperty('auth') && pageData.auth == true && isAuthenticated)
		{
			// not allowed, goto home
			Gaia.api.goto('/index');
		}
		// redirect to 'next' page if already authenticated
		else if (pageData.hasOwnProperty('ifAuthenticated') && isAuthenticated)
		{
			Gaia.api.goto(pageData.ifAuthenticated);
		}
		else
		{
			// allowed, just continue
			this._beforeGotoHijack();
		}

		//todo: add 'current' class to the current active page (leaf)
	}
}

export = Main;

/**
 * @class IPageData
 */
interface IPageData
{

	/**
	 * Redirects to /index if auth is true and not authenticated
	 * @property auth
	 * @type string
	 * @optional
	 */
	auth?:boolean;

	// Redirects to page if authenticated
	/**
	 * Redirects to page if authenticated
	 * @property ifAuthenticated
	 * @type string
	 * @optional
	 */
	ifAuthenticated?:string;
}