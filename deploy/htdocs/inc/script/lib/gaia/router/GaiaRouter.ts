//import Gaia = require('lib/gaia/api/Gaia');
//import BranchTools = require('lib/gaia/core/BranchTools');
//import SiteModel = require('lib/gaia/core/SiteModel');

import GaiaRouterConfig = require('lib/gaia/router/GaiaRouterConfig');
import rg = require('lib/gaia/router/GaiaRouteGroup');
import GaiaRoute = require('lib/gaia/router/GaiaRoute');
import GaiaRouteRequirement = require('lib/gaia/router/GaiaRouteRequirement');
import GaiaRouteConvert = require('lib/gaia/router/GaiaRouteConvert');
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');
import RouteResultItem = require('lib/gaia/router/RouteResultItem');

/**
 * @namespace gaia.router
 * @class GaiaRouter
 */
class GaiaRouter
{
	private _config:GaiaRouterConfig;
	private _group:rg.GaiaRouteGroup;
	private _notFound:string;

	constructor()
	{
		this._config = new GaiaRouterConfig();
		this._group = new rg.GaiaRouteGroup(this._config);
	}

	/**
	 * @method config
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public config()
	{
		return this._config;
	}

	/**
	 * @method notFound
	 * @param {string} branch
	 * @returns {GaiaRouter}
	 */
	public notFound(branch:string):GaiaRouter
	{
		this._notFound = branch;

		return this;
	}

	public redirect(route:string, redirect:string):GaiaRoute
	{
		return this._group.redirect(route, redirect);
	}

	public handle(route:string, callback:(params:any) => any):GaiaRoute
	{
		return this._group.handle(route, callback);
	}

	public page(route:string, branch:string):GaiaRoute
	{
		return this._group.page(route, branch);
	}

	public alias(route:string, branch:string):GaiaRoute
	{
		return this._group.alias(route, branch);
	}


	public childPage(route:string, branch:string):GaiaRoute
	{
		return this._group.childPage(route, branch);
	}

//	public resolve(url:string):IRouteResultItem
//	{
//		console.log('resolve: ', url);
//
//		for (var i = 0; i < this._routeActions.length; i++)
//		{
//			var routeAction = this._routeActions[i];
//
//			if (routeAction.route.isMatch(url))
//			{
////				console.log('matched : ', routeAction.route);
//
//				if (routeAction.type == RouteAction.REDIRECT)
//				{
//					// re-feed the redirect route to the resolver
//					return this.resolve(routeAction.execute(url));
//				}
//				else
//				{
//					return routeAction.execute(url);
//				}
//			}
//
//		}
//
////		if (this.config().isUsingFallback())
////		{
////			return [SiteModel.getRoutes()[BranchTools.getValidRoute(url.substr(1))],{deeplink: BranchTools.getRouteDeeplink(url.substr(1))}];
////		}
//
//		if (this._notFound)
//		{
//			// todo: goto 404 route
//			return [{branch: this._notFound, deeplink: {}}];
//		}
//		else
//		{
//			// todo: goto home
//			return [{branch: 'index', deeplink: {}}];
//		}
//	}

	public resolvePage(url:string, includeRedirects:boolean = false, isLanding:boolean = false):IRouteResultItem
	{
		var i:number;
		if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1) url = url.substr(0, i);

		var result = this._group.resolvePage(url, includeRedirects, isLanding);

		if (result.length > 0)
		{
			return result;
		}

		if (this._notFound)
		{
			// todo: goto 404 route
			return new RouteResultItem([{branch: this._notFound, deeplink: {}}], url);
		}
		else
		{
			// todo: goto home
			return new RouteResultItem([{branch: 'index', deeplink: {}}], url);
		}
	}

	public assemble(branch:string, params:any = {}):string
	{
		var route = this._group.getRoute(branch, params);

		return route ? route.assemble(params) : null;
	}

	public getGroup():rg.GaiaRouteGroup
	{
		return this._group;
	}
}

export = GaiaRouter;