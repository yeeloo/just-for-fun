//import Gaia = require('lib/gaia/api/Gaia');
//import BranchTools = require('lib/gaia/core/BranchTools');
//import SiteModel = require('lib/gaia/core/SiteModel');
define(["require", "exports", 'lib/gaia/router/GaiaRoute', 'lib/gaia/router/RouteResultItem'], function (require, exports, GaiaRoute, RouteResultItem) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteGroup
     */
    var GaiaRouteGroup = (function () {
        function GaiaRouteGroup(config) {
            this._routes = [];
            this._config = config;
        }
        GaiaRouteGroup.prototype.redirect = function (route, redirect) {
            return this.addRoute(new GaiaRoute(route, new RedirectAction(redirect)));
        };
        GaiaRouteGroup.prototype.handle = function (route, callback) {
            return this.addRoute(new GaiaRoute(route, new HandleAction(callback)));
        };
        GaiaRouteGroup.prototype.page = function (route, branch) {
            return this.addRoute(new GaiaRoute(route, new PageAction(branch)));
        };
        GaiaRouteGroup.prototype.alias = function (route, branch) {
            return this.addRoute(new GaiaRoute(route, new PageAction(branch, 3 /* ALIAS */)));
        };
        GaiaRouteGroup.prototype.childPage = function (route, branch) {
            if (typeof route === 'string') {
                return this.addRoute(new GaiaRoute(route, new PageAction(branch)), true);
            }
            else {
                this._routes.push(route);
                return route;
            }
        };
        GaiaRouteGroup.prototype.addRoute = function (route, addToGroup) {
            if (addToGroup === void 0) { addToGroup = true; }
            if (addToGroup) {
                this._routes.push(route);
            }
            for (var i = 0; i < this._config.getRequirements().length; i++) {
                var requirement = this._config.getRequirements()[i];
                if (route.getGroupName(requirement.name)) {
                    route.assert(requirement.name, requirement.assertion);
                }
            }
            for (var i = 0; i < this._config.getConverts().length; i++) {
                var convert = this._config.getConverts()[i];
                if (route.getGroupName(convert.name)) {
                    route.convert(convert.name, convert.callback);
                }
            }
            return route;
        };
        GaiaRouteGroup.prototype.resolvePage = function (url, includeRedirects, isLanding) {
            //		console.log('GaiaRouteGroup::resolvePage: ', url, includeRedirects, isLanding, this._routes.length);
            if (includeRedirects === void 0) { includeRedirects = false; }
            if (isLanding === void 0) { isLanding = false; }
            for (var i = 0; i < this._routes.length; i++) {
                var route = this._routes[i];
                //			console.log(' try: ', route.getRoute());
                if (route.isMatch(url)) {
                    //				console.log('matched : ', routeAction.route);
                    if (route.getAction().type == 0 /* REDIRECT */) {
                        if (includeRedirects) {
                            // re-feed the redirect route to the resolver
                            return this.resolvePage(route.getAction().execute(url, includeRedirects), includeRedirects);
                        }
                    }
                    else if (route.getAction().type == 2 /* PAGE */) {
                        if (isLanding && route.getLandingRedirect()) {
                            if (includeRedirects) {
                                // re-feed the redirect route to the resolver
                                return this.resolvePage(route.getLandingRedirect(), includeRedirects);
                            }
                        }
                        else {
                            return route.getAction().getPage(url, route, includeRedirects);
                        }
                    }
                }
            }
            //		if (this.config().isUsingFallback())
            //		{
            //			return [SiteModel.getRoutes()[BranchTools.getValidRoute(url.substr(1))],{deeplink: BranchTools.getRouteDeeplink(url.substr(1))}];
            //		}
            return new RouteResultItem([]);
        };
        GaiaRouteGroup.prototype.getRoute = function (branch, params) {
            if (params === void 0) { params = {}; }
            // filter on branches
            var matches = this._routes.filter(function (element) {
                return (element.getAction().type == 2 /* PAGE */ && element.getAction().branch == branch);
            });
            // sort on length
            matches.sort(function (a, b) {
                return a.getRoute().length < b.getRoute().length ? -1 : 1;
            });
            // filter on deeplink options if we have more than 1 match
            if (matches.length > 1 && typeof params !== 'undefined') {
                // deeplink params passed
                var deeplinkKeys = Object.keys(params);
                matches = matches.filter(function (element) {
                    for (var i = 0; i < deeplinkKeys.length; i++) {
                        var key = deeplinkKeys[i];
                        if (!element.getGroupName(key) || !element._assertParam(key, params[key])) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (matches.length == 0) {
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
            if (matches.length > 1) {
                DEBUG && console.info('We have multiple candidates, I hope I picked the right one', matches);
            }
            return matches[0];
        };
        GaiaRouteGroup.prototype.getRouteByRoute = function (route) {
            for (var i = 0; i < this._routes.length; i++) {
                if (this._routes[i].getRoute() == route) {
                    return this._routes[i];
                }
            }
            return null;
        };
        return GaiaRouteGroup;
    })();
    exports.GaiaRouteGroup = GaiaRouteGroup;
    var RedirectAction = (function () {
        function RedirectAction(redirect) {
            this.redirect = redirect;
            this.type = 0 /* REDIRECT */;
        }
        RedirectAction.prototype.execute = function (url, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            // todo: goto new route
            console.log('redirect to: ' + this.redirect);
            return this.redirect;
        };
        return RedirectAction;
    })();
    exports.RedirectAction = RedirectAction;
    var HandleAction = (function () {
        function HandleAction(callback) {
            this.callback = callback;
            this.type = 1 /* HANDLE */;
            this.callback.call(null);
        }
        HandleAction.prototype.execute = function (url, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            return null;
        };
        return HandleAction;
    })();
    exports.HandleAction = HandleAction;
    var PageAction = (function () {
        function PageAction(branch, type) {
            if (type === void 0) { type = 2 /* PAGE */; }
            this.branch = branch;
            this.type = type;
        }
        PageAction.prototype.execute = function (url, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            console.error('not used');
        };
        PageAction.prototype.getPage = function (url, route, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            var result = new RouteResultItem([{ branch: this.branch, deeplink: route.getParams() }], url);
            //		result = (route.resolveChildren(url) || []).concat(result);
            return result;
        };
        return PageAction;
    })();
    exports.PageAction = PageAction;
    (function (RouteAction) {
        RouteAction[RouteAction["REDIRECT"] = 0] = "REDIRECT";
        RouteAction[RouteAction["HANDLE"] = 1] = "HANDLE";
        RouteAction[RouteAction["PAGE"] = 2] = "PAGE";
        RouteAction[RouteAction["ALIAS"] = 3] = "ALIAS";
    })(exports.RouteAction || (exports.RouteAction = {}));
    var RouteAction = exports.RouteAction;
});
