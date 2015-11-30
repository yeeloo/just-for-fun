define(["require", "exports", 'lib/temple/config/ConfigManager', 'app/config/config', "lib/temple/control/sequence/Sequence", "lib/temple/control/sequence/tasks/MethodTask", "app/control/DevBarTask"], function (require, exports, ConfigManager, config, Sequence, MethodTask, dbt) {
    // localization
    //import ilt = require("app/control/InitLocaleTask");
    //import LocaleManager = require('lib/temple/locale/LocaleManager');
    //import lg = require('lib/temple/locale/LocaleGaiaHistoryHook');
    /**
     * @namespace app.control
     * @class StartUp
     */
    var StartUp = (function () {
        /**
         * Initializes knockout allowBindings
         *
         * @class StartUp
         * @constructor
         */
        function StartUp() {
        }
        StartUp.prototype.execute = function (callback) {
            if (callback === void 0) { callback = null; }
            this._callback = callback;
            ConfigManager.getInstance().init(config);
            this._sequence = new Sequence();
            if (DEBUG && ConfigManager.getInstance().getEnvironment() != 'live' && ConfigManager.getInstance().getEnvironment() != 'prod' && ConfigManager.getInstance().getEnvironment() != 'production') {
                this._sequence.add(new dbt.DevBarTask());
            }
            // add your own tasks
            //this._sequence.add(new ilt.InitLocaleTask());
            this._sequence.add(new MethodTask(this.onSequenceDone.bind(this)));
            this._sequence.execute();
        };
        StartUp.prototype.onSequenceDone = function () {
            if (this._callback) {
                this._callback();
            }
        };
        StartUp.prototype.afterGaia = function () {
            this.finishLocale();
        };
        StartUp.prototype.finishLocale = function () {
            // localization
            //new LocaleGaiaHistoryHook();
            //
            //if (LocaleManager.getInstance().getLocale() == undefined)
            //{
            //	LocaleManager.getInstance().setLocale(ConfigManager.getInstance().getProperty('defaultLocale'));
            //}
            //
            //ConfigManager.getInstance().setVar('locale', LocaleManager.getInstance().getLocale());
        };
        return StartUp;
    })();
    return StartUp;
});
