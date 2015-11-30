//import Gaia = require('lib/gaia/api/Gaia');
//import BranchTools = require('lib/gaia/core/BranchTools');
//import SiteModel = require('lib/gaia/core/SiteModel');
define(["require", "exports", 'lib/gaia/router/GaiaRouterConfig', 'lib/gaia/router/GaiaRouteGroup', 'lib/gaia/router/RouteResultItem'], function (require, exports, GaiaRouterConfig, rg, RouteResultItem) {
    /**
     * @namespace gaia.router
     * @class GaiaRouter
     */
    var GaiaRouter = (function () {
        function GaiaRouter() {
            this._config = new GaiaRouterConfig();
            this._group = new rg.GaiaRouteGroup(this._config);
        }
        /**
         * @method config
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouter.prototype.config = function () {
            return this._config;
        };
        /**
         * @method notFound
         * @param {string} branch
         * @returns {GaiaRouter}
         */
        GaiaRouter.prototype.notFound = function (branch) {
            this._notFound = branch;
            return this;
        };
        GaiaRouter.prototype.redirect = function (route, redirect) {
            return this._group.redirect(route, redirect);
        };
        GaiaRouter.prototype.handle = function (route, callback) {
            return this._group.handle(route, callback);
        };
        GaiaRouter.prototype.page = function (route, branch) {
            return this._group.page(route, branch);
        };
        GaiaRouter.prototype.alias = function (route, branch) {
            return this._group.alias(route, branch);
        };
        GaiaRouter.prototype.childPage = function (route, branch) {
            return this._group.childPage(route, branch);
        };
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
        GaiaRouter.prototype.resolvePage = function (url, includeRedirects, isLanding) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            if (isLanding === void 0) { isLanding = false; }
            var i;
            if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1)
                url = url.substr(0, i);
            var result = this._group.resolvePage(url, includeRedirects, isLanding);
            if (result.length > 0) {
                return result;
            }
            if (this._notFound) {
                // todo: goto 404 route
                return new RouteResultItem([{ branch: this._notFound, deeplink: {} }], url);
            }
            else {
                // todo: goto home
                return new RouteResultItem([{ branch: 'index', deeplink: {} }], url);
            }
        };
        GaiaRouter.prototype.assemble = function (branch, params) {
            if (params === void 0) { params = {}; }
            var route = this._group.getRoute(branch, params);
            return route ? route.assemble(params) : null;
        };
        GaiaRouter.prototype.getGroup = function () {
            return this._group;
        };
        return GaiaRouter;
    })();
    return GaiaRouter;
});
