var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/core/Destructible'], function (require, exports, Destructible) {
    /**
     * @module Temple
     * @namespace temple.locale.provider.core
     * @extend temple.core.Destructible
     * @class AbstractLocaleProvider
     */
    var AbstractLocaleProvider = (function (_super) {
        __extends(AbstractLocaleProvider, _super);
        function AbstractLocaleProvider(localeManager) {
            _super.call(this);
            this._debug = false;
            this.localeManager = localeManager;
            this.localeManager.addLocaleProvider(this);
        }
        /**
         * @public
         * @method provider
         * @param {string} locale
         */
        AbstractLocaleProvider.prototype.provide = function (locale) {
            console.error('Abstract class, please extend and override this method');
        };
        /**
         * @public
         * @method hasProvided
         * @param {string}locale
         * @returns {boolean}
         */
        AbstractLocaleProvider.prototype.hasProvided = function (locale) {
            return false;
        };
        /**
         * @public
         * @method hasLocale
         * @param {string} locale
         * @returns {boolean}
         */
        AbstractLocaleProvider.prototype.hasLocale = function (locale) {
            return false;
        };
        /**
         * @public
         * @method getLocales
         * @returns {any[]}
         */
        AbstractLocaleProvider.prototype.getLocales = function () {
            return null;
        };
        /**
         * @public
         * @method destruct
         */
        AbstractLocaleProvider.prototype.destruct = function () {
            this.localeManager = null;
            _super.prototype.destruct.call(this);
        };
        return AbstractLocaleProvider;
    })(Destructible);
    return AbstractLocaleProvider;
});
