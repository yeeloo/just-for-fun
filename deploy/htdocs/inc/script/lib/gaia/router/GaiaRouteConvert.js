define(["require", "exports"], function (require, exports) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteConvert
     */
    var GaiaRouteConvert = (function () {
        /**
         * @class GaiaRouteConvert
         * @constructor
         * @param {string} name
         * @param {Function} callback
         */
        function GaiaRouteConvert(name, callback) {
            this.name = name;
            this.callback = callback;
        }
        return GaiaRouteConvert;
    })();
    return GaiaRouteConvert;
});
