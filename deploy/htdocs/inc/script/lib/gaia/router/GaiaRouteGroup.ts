//import Gaia = require('lib/gaia/api/Gaia');
//import BranchTools = require('lib/gaia/core/BranchTools');
//import SiteModel = require('lib/gaia/core/SiteModel');

import GaiaRouterConfig = require('lib/gaia/router/GaiaRouterConfig');
import GaiaRoute = require('lib/gaia/router/GaiaRoute');
import GaiaRouteRequirement = require('lib/gaia/router/GaiaRouteRequirement');
import GaiaRouteConvert = require('lib/gaia/router/GaiaRouteConvert');
import RouteResultItem = require('lib/gaia/router/RouteResultItem');
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');
import IRouteResult = require('lib/gaia/router/IRouteResult');

/**
 * @namespace gaia.router
 * @class GaiaRouteGroup
 */
export class GaiaRouteGroup
{
	private _config:GaiaRouterConfig;
	private _routes:Array<GaiaRoute> = [];

	constructor(config:GaiaRouterConfig)
	{
		this._config = config;
	}

	public redirect(route:string, redirect:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new RedirectAction(redirect)));
	}

	public handle(route:string, callback:(params:any) => any):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new HandleAction(callback)));
	}

	public page(route:string, branch:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new PageAction(branch)));
	}

	public alias(route:string, branch:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new PageAction(branch, RouteAction.ALIAS)));
	}


	public childPage(route:GaiaRoute):GaiaRoute;
	public childPage(route:string, branch:string):GaiaRoute;
	public childPage(route:any, branch?:string):GaiaRoute
	{
		if (typeof route === 'string')
		{
			return this.addRoute(new GaiaRoute(route, new PageAction(branch)), true);
		}
		else
		{
			this._routes.push(route);

			return route;
		}
	}

	private addRoute(route:GaiaRoute, addToGroup:boolean = true):GaiaRoute
	{
		if (addToGroup)
		{
			this._routes.push(route);
		}

		for (var i = 0; i < this._config.getRequirements().length; i++)
		{
			var requirement:GaiaRouteRequirement = this._config.getRequirements()[i];
			if (route.getGroupName(requirement.name))
			{
				route.assert(requirement.name, requirement.assertion);
			}
		}

		for (var i = 0; i < this._config.getConverts().length; i++)
		{
			var convert:GaiaRouteConvert = this._config.getConverts()[i];
			if (route.getGroupName(convert.name))
			{
				route.convert(convert.name, convert.callback);
			}
		}

		return route;
	}

	public resolvePage(url:string, includeRedirects:boolean = false, isLanding:boolean = false):IRouteResultItem
	{
//		console.log('GaiaRouteGroup::resolvePage: ', url, includeRedirects, isLanding, this._routes.length);

		for (var i = 0; i < this._routes.length; i++)
		{
			var route = this._routes[i];

//			console.log(' try: ', route.getRoute());
			if (route.isMatch(url))
			{
//				console.log('matched : ', routeAction.route);

				if (route.getAction().type == RouteAction.REDIRECT)
				{
					if (includeRedirects)
					{
						// re-feed the redirect route to the resolver
						return this.resolvePage(route.getAction().execute(url, includeRedirects), includeRedirects);
					}
				}
				else if (route.getAction().type == RouteAction.PAGE)
				{
					if (isLanding && route.getLandingRedirect())
					{
						if (includeRedirects)
						{
							// re-feed the redirect route to the resolver
							return this.resolvePage(route.getLandingRedirect(), includeRedirects);
						}
					}
					else
					{
						return (<PageAction>route.getAction()).getPage(url, route, includeRedirects);
					}
				}
			}
		}

//		if (this.config().isUsingFallback())
//		{
//			return [SiteModel.getRoutes()[BranchTools.getValidRoute(url.substr(1))],{deeplink: BranchTools.getRouteDeeplink(url.substr(1))}];
//		}

		return new RouteResultItem([]);
	}

	public getRoute(branch:string, params:any = {}):GaiaRoute
	{
		// filter on branches
		var matches = this._routes.filter((element) =>
		{
			return (element.getAction().type == RouteAction.PAGE && (<PageAction>element.getAction()).branch == branch);
		});

		// sort on length
		matches.sort((a, b) =>
		{
			return a.getRoute().length < b.getRoute().length ? -1 : 1;
		});

		// filter on deeplink options if we have more than 1 match
		if (matches.length > 1 && typeof params !== 'undefined')
		{
			// deeplink params passed
			var deeplinkKeys = Object.keys(params);

			matches = matches.filter((element) =>
			{
				for (var i = 0; i < deeplinkKeys.length; i++)
				{
					var key = deeplinkKeys[i];

					if (!element.getGroupName(key) || !element._assertParam(key, params[key]))
					{
						return false;
					}
				}

				return true;
			});
		}

		if (matches.length == 0)
		{
//			if (this.config().isUsingFallback())
//			{
//				var url = '/' + Gaia.api.getPage(branch).route.base;
//				if (typeof params !== 'undefined')
//				{
//					for (var key in params)
//					{
//						if (String(params[key]).length > 0)
//						{
//							if (String(params[key]).charAt(0) != '/')
//							{
//								url += '/';
//							}
//							url += params[key];
//						}
//					}
//				}
//				return url;
//			}

			DEBUG && !this._config.isUsingFallback() && console.warn('No match found for "' + branch + '" with deeplink ' + JSON.stringify(params));
			return null;
		}

		if (matches.length > 1)
		{
			DEBUG && console.info('We have multiple candidates, I hope I picked the right one', matches);
//			console.log(JSON.stringify(matches));
		}

		return matches[0];
	}

	public getRouteByRoute(route:string):GaiaRoute
	{
		for (var i = 0; i < this._routes.length; i++)
		{
			if (this._routes[i].getRoute() == route)
			{
				return this._routes[i];
			}
		}
		return null;
	}
}

export interface IRouteAction
{
	type:RouteAction;

	execute(url:string, includeRedirects?:boolean):any;
}

export class RedirectAction implements IRouteAction
{
	public type:RouteAction = RouteAction.REDIRECT;

	constructor(public redirect:string)
	{

	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		// todo: goto new route
		console.log('redirect to: ' + this.redirect);

		return this.redirect;
	}
}

export class HandleAction implements IRouteAction
{
	public type:RouteAction = RouteAction.HANDLE;

	constructor(public callback:(params:any) => any)
	{
		this.callback.call(null);
	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		return null;
	}
}

export class PageAction implements IRouteAction
{
	constructor(public branch:string, public type:RouteAction = RouteAction.PAGE)
	{

	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		console.error('not used');
	}

	public getPage(url:string, route:GaiaRoute, includeRedirects:boolean = false):IRouteResultItem
	{
		var result:IRouteResultItem = new RouteResultItem([{branch: this.branch, deeplink: route.getParams()}], url);

//		result = (route.resolveChildren(url) || []).concat(result);

		return result;
	}
}

export enum RouteAction
{
	REDIRECT,
	HANDLE,
	PAGE,
	ALIAS
}