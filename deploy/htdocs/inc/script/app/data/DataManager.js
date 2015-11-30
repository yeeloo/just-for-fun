define(["require", "exports", "app/net/Gateway", 'lib/temple/config/ConfigManager'], function (require, exports, gw, ConfigManager) {
    /**
     * @namespace app.data
     * @class DataManager
     */
    var DataManager = (function () {
        /**
         * @class DataManager
         * @constructor
         */
        function DataManager() {
            this.gateway = new gw.Gateway(ConfigManager.getInstance().getUrl('api'));
        }
        /**
         * Returns a instance of the datamanager
         *
         * @method getInstance
         * @returns {DataManager}
         */
        DataManager.getInstance = function () {
            if (!DataManager._instance) {
                DataManager._instance = new DataManager();
                window['dataManager'] = DataManager._instance;
            }
            return DataManager._instance;
        };
        return DataManager;
    })();
    return DataManager;
});
