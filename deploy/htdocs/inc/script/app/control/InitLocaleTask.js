var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask", 'lib/temple/locale/LocaleManager', 'lib/temple/locale/LocaleKnockoutBinding'], function (require, exports, AbstractTask, LocaleManager, LocaleKnockoutBinding) {
    /*
     * Choose your provider
     */
    //import JSONLocaleProvider = require('lib/temple/locale/provider/JSONLocaleProvider');
    //import JSONPLocaleProvider = require('lib/temple/locale/provider/JSONPLocaleProvider');
    //import XMLLocaleProvider = require('lib/temple/locale/provider/XMLLocaleProvider');
    //import XMLPLocaleProvider = require('lib/temple/locale/provider/XMLPLocaleProvider');
    /**
     * @namespace app.control
     * @class InitLocaleTask
     * @extend temple.control.sequence.tasks.AbstractTask
     */
    var InitLocaleTask = (function (_super) {
        __extends(InitLocaleTask, _super);
        /**
         * @class InitLocaleTask
         * @constructor InitLocaleTask
         * @param {string} fallbackLocale
         */
        function InitLocaleTask(fallbackLocale) {
            if (fallbackLocale === void 0) { fallbackLocale = 'debug'; }
            _super.call(this);
            this._fallbackLocale = fallbackLocale;
        }
        /**
         * @inheritDoc
         */
        InitLocaleTask.prototype.executeTaskHook = function () {
            // localization
            new LocaleKnockoutBinding();
            LocaleManager.getInstance().setFallbackLocale(this._fallbackLocale);
            // optional, add aliases for mapping http://yourwebsite/nl to http://yourwebsite/nl_NL
            LocaleManager.getInstance().addAlias('nl', 'nl_NL');
            // choose your poison!
            //var jsonProvider= new JSONLocaleProvider(LocaleManager.getInstance());
            //jsonProvider.addLocaleFile('en_GB', 'data/locale/en_GB.json', true);
            //jsonProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.json', true);
            //var xmlProvider = new XMLPLocaleProvider(LocaleManager.getInstance());
            //xmlProvider.addLocaleFile('en_GB', 'data/locale/en_GB.xmlp', true);
            //xmlProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.xmlp', true);
            this.done();
        };
        /**
         * @inheritDoc
         */
        InitLocaleTask.prototype.destruct = function () {
            this._fallbackLocale = null;
            _super.prototype.destruct.call(this);
        };
        return InitLocaleTask;
    })(AbstractTask);
    return InitLocaleTask;
});
