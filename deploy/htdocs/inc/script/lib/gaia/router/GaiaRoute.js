define(["require", "exports", 'lib/gaia/router/GaiaRouteGroup', './GaiaRouteRequirement', './GaiaRouteConvert'], function (require, exports, rg, GaiaRouteRequirement, GaiaRouteConvert) {
    /**
     * @namespace gaia.router
     * @class GaiaRoute
     */
    var GaiaRoute = (function () {
        /**
         * @class GaiaRoute
         * @constructor
         * @param {string} route
         * @param {IRouteAction} action
         */
        function GaiaRoute(route, action) {
            this._groupNames = [];
            this._params = {};
            this._requirements = {};
            this._defaults = {};
            this._converts = {};
            this._redirectOnLanding = null;
            this._map = [];
            this._beforeMatches = [];
            this._afterMatches = {};
            this._children = [];
            this._route = route;
            this._action = action;
            this._group = new rg.GaiaRouteGroup(null);
        }
        GaiaRoute.prototype.assert = function (name, assertion) {
            this._requirements[name] = new GaiaRouteRequirement(name, assertion);
            return this;
        };
        GaiaRoute.prototype.value = function (name, value) {
            this._defaults[name] = value;
            return this;
        };
        GaiaRoute.prototype.map = function (names) {
            this._map = names.concat();
            return this;
        };
        GaiaRoute.prototype.spec = function (spec) {
            this._spec = spec;
            return this;
        };
        GaiaRoute.prototype.convert = function (name, callback) {
            this._converts[name] = new GaiaRouteConvert(name, callback);
            return this;
        };
        GaiaRoute.prototype.redirectOnLanding = function (route) {
            if (route === void 0) { route = '/'; }
            this._redirectOnLanding = route;
            return this;
        };
        GaiaRoute.prototype.beforeMatch = function (name, callback) {
            this._beforeMatches.push(new Matcher(name, callback));
            return this;
        };
        GaiaRoute.prototype.afterMatch = function (name, callback) {
            if (!this._afterMatches[name]) {
                this._afterMatches[name] = [];
            }
            this._afterMatches[name].push(new Matcher(name, callback));
            return this;
        };
        GaiaRoute.prototype.children = function (children) {
            throw new Error('not implemented yet');
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
            return this;
        };
        GaiaRoute.prototype.addChild = function (route) {
            throw new Error('not implemented yet');
            //		console.log('Route::addChild');
            route.setParent(this);
            this._group.childPage(route);
            return this;
        };
        GaiaRoute.prototype.setParent = function (route) {
            this._parentRoute = route;
            this._regExp = null;
            return this;
        };
        GaiaRoute.prototype.updateRegExp = function () {
            var _this = this;
            if (!this._regExp) {
                var groupNameObj = {};
                var route = this._route['replace'](/\/:([a-z]+)([\?\*])?/gi, function (substring, groupName, modifier) {
                    var replacment = '';
                    groupNameObj[groupName] = {};
                    if (modifier == '*') {
                        groupNameObj[groupName].greedy = true;
                        replacment = '(?<' + groupName + '>\/.*?)';
                    }
                    else if (modifier == '?' || groupName in _this._defaults) {
                        groupNameObj[groupName].optional = true;
                        replacment = '(?:\/(?<' + groupName + '>[^\/]+))?\/?';
                    }
                    else {
                        replacment = '(?:\/(?<' + groupName + '>[^\/]+))\/?';
                    }
                    return replacment;
                });
                this._regExpRoute = route;
                this._regExp = XRegExp('^' + (this._parentRoute ? this._parentRoute.getRegexpRoute() : '') + this._regExpRoute + '$', 'i');
                //			console.log('^' + (this._parentRoute ? this._parentRoute.getRegexpRoute() : '') + this._regExpRoute + '$');
                var names = this._regExp.xregexp.captureNames ? this._regExp.xregexp.captureNames.concat() : [];
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];
                    if (name) {
                        this._groupNames.push({
                            name: name,
                            optional: groupNameObj[name] ? groupNameObj[name].optional : false,
                            greedy: groupNameObj[name] ? groupNameObj[name].greedy : false
                        });
                    }
                    else {
                        if (DEBUG) {
                            console.warn('ignoring unnamed group in route "' + this._route + '"');
                        }
                    }
                }
            }
            return this._regExp;
        };
        GaiaRoute.prototype.isMatch = function (url) {
            var match = XRegExp['exec'](url, this.updateRegExp());
            if (match == null) {
                return false;
            }
            if (match) {
                for (var i = 0; i < this._groupNames.length; i++) {
                    var groupName = this._groupNames[i].name;
                    var groupMatch = match[groupName];
                    if (groupMatch) {
                        if (!this._assertParam(groupName, groupMatch)) {
                            return false;
                        }
                    }
                    if (!groupMatch && groupName in this._defaults) {
                        groupMatch = this._defaults[groupName];
                    }
                    if (groupMatch) {
                        if (groupName in this._converts) {
                            groupMatch = this._converts[groupName].callback.call(null, groupMatch);
                        }
                    }
                    this._params[groupName] = groupMatch;
                }
            }
            return true;
        };
        GaiaRoute.prototype.resolveChildren = function (url) {
            //		console.log('resolveChildren: ', url);
            return this._group.resolvePage(url);
        };
        GaiaRoute.prototype.assemble = function (deeplink) {
            var _this = this;
            if (this._spec) {
                return this._spec['replace'](/\/\{([^}]+)\}/gi, function (result, groupName) {
                    // parts incl starting '/' that gets removed when part is optional
                    if (deeplink.hasOwnProperty(groupName)) {
                        return '/' + deeplink[groupName];
                    }
                    else {
                        if (_this.getGroupName(groupName) && !_this.getGroupName(groupName).optional) {
                            console.error('spec: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + _this._route);
                        }
                        return '';
                    }
                })['replace'](/\{([^}]+)\}/gi, function (result, groupName) {
                    // parts excl starting '/'
                    if (deeplink.hasOwnProperty(groupName)) {
                        return deeplink[groupName];
                    }
                    else {
                        if (_this.getGroupName(groupName) && !_this.getGroupName(groupName).optional) {
                            console.error('spec: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + _this._route);
                        }
                        return '';
                    }
                });
            }
            return this._route['replace'](/\/:([a-z]+)([\?\*])?/gi, function (substring, groupName, modifier) {
                if (_this.getGroupName(groupName).optional) {
                    // if a property is provided in the deeplink object
                    if (deeplink && deeplink.hasOwnProperty(groupName)) {
                        return '/' + deeplink[groupName];
                    }
                    // if we have a default value for this property
                    if (_this._defaults.hasOwnProperty(groupName)) {
                        return '/' + _this._defaults[groupName];
                    }
                    // we don't have any value for this groupName
                    return '';
                }
                else {
                    if (deeplink && deeplink.hasOwnProperty(groupName)) {
                        return '/' + deeplink[groupName];
                    }
                    else {
                        console.error('route: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + _this._route);
                        return '';
                    }
                }
            }) || '/';
        };
        GaiaRoute.prototype._assertParam = function (param, value) {
            this.updateRegExp();
            var success = !(param in this._requirements) || (param in this._requirements && this._requirements[param].assert(value));
            if (DEBUG) {
                if (!success) {
                    if (param in this._requirements) {
                        console.info('assertion failed for param "' + param + '" failed on requirement "' + this._requirements[param].assertion.toString() + '" - value: ' + value);
                    }
                }
            }
            return success;
        };
        GaiaRoute.prototype.getParams = function () {
            return this._params;
        };
        GaiaRoute.prototype.getRoute = function () {
            return this._route;
        };
        GaiaRoute.prototype.getRegexpRoute = function () {
            return this._regExpRoute;
        };
        GaiaRoute.prototype.getLandingRedirect = function () {
            return this._redirectOnLanding;
        };
        GaiaRoute.prototype.getGroupNames = function () {
            this.updateRegExp();
            return this._groupNames;
        };
        GaiaRoute.prototype.getGroupName = function (name) {
            this.updateRegExp();
            for (var i = 0; i < this._groupNames.length; i++) {
                var group = this._groupNames[i];
                if (group.name == name)
                    return group;
            }
            return null;
        };
        GaiaRoute.prototype.getAction = function () {
            return this._action;
        };
        GaiaRoute.prototype.setBranch = function (branch) {
            this._action.branch = branch;
        };
        return GaiaRoute;
    })();
    var Matcher = (function () {
        function Matcher(name, callback) {
            this.name = name;
            this.callback = callback;
        }
        return Matcher;
    })();
    return GaiaRoute;
});
