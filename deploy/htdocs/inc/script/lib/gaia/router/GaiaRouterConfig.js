define(["require", "exports", 'lib/gaia/router/GaiaRouteRequirement', 'lib/gaia/router/GaiaRouteConvert'], function (require, exports, GaiaRouteRequirement, GaiaRouteConvert) {
    /**
     * @namespace gaia.router
     * @class GaiaRouterConfig
     */
    var GaiaRouterConfig = (function () {
        function GaiaRouterConfig() {
            this._enabled = true;
            this._includeQueryString = false;
            this._useFallback = false;
            this._removeExtraSlashes = false;
            this._requirements = [];
            this._converts = [];
        }
        /**
         * @public
         * @method disable
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.disable = function () {
            this._enabled = false;
            return this;
        };
        /**
         * @public
         * @method enable
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.enable = function () {
            this._enabled = true;
            return this;
        };
        /**
         * @public
         * @method useFallback
         * @param {boolean} value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.useFallback = function (value) {
            if (value === void 0) { value = true; }
            this._useFallback = value;
            return this;
        };
        /**
         * @public
         * @method includeQueryString
         * @param value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.includeQueryString = function (value) {
            if (value === void 0) { value = true; }
            this._includeQueryString = value;
            return this;
        };
        /**
         * @public
         * @method isQueryStringIncluded
         * @returns {boolean}
         */
        GaiaRouterConfig.prototype.isQueryStringIncluded = function () {
            return this._includeQueryString;
        };
        /**
         * @public
         * @method isUsingFallback
         * @returns {boolean}
         */
        GaiaRouterConfig.prototype.isUsingFallback = function () {
            return this._useFallback;
        };
        /**
         * @public
         * @method removeExtraSlashes
         * @param value
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.removeExtraSlashes = function (value) {
            if (value === void 0) { value = true; }
            this._removeExtraSlashes = value;
            return this;
        };
        GaiaRouterConfig.prototype.assert = function (name, assertion) {
            this._requirements.push(new GaiaRouteRequirement(name, assertion));
            return this;
        };
        /**
         * @public
         * @method convert
         * @param name
         * @param callback
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.convert = function (name, callback) {
            this._converts.push(new GaiaRouteConvert(name, callback));
            return this;
        };
        /**
         * @public
         * @method setLocale
         * @param locale
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.setLocale = function (locale) {
            return this;
        };
        /**
         * @public
         * @method setTranslator
         * @param translator
         * @param translationPath
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouterConfig.prototype.setTranslator = function (translator, translationPath) {
            return this;
        };
        /**
         * @public
         * @method getRequirements
         * @returns {gaia.router.GaiaRouteRequirement[]}
         */
        GaiaRouterConfig.prototype.getRequirements = function () {
            return this._requirements;
        };
        /**
         * @public
         * @method getConverts
         * @returns {gaia.router.GaiaRouteConvert[]}
         */
        GaiaRouterConfig.prototype.getConverts = function () {
            return this._converts;
        };
        return GaiaRouterConfig;
    })();
    return GaiaRouterConfig;
});
