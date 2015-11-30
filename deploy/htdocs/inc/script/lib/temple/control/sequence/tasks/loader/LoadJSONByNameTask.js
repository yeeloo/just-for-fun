var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/config/ConfigManager', "LoadJSONTask"], function (require, exports, ConfigManager, LoadJSONTask) {
    var LoadJSONByNameTask = (function (_super) {
        __extends(LoadJSONByNameTask, _super);
        /**
         * @param name {string}
         * @param completeCallback {Function}
         * @param jsonpCallback {string}
         */
        function LoadJSONByNameTask(name, completeCallback, jsonpCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            if (jsonpCallback === void 0) { jsonpCallback = null; }
            _super.call(this, null, completeCallback, jsonpCallback);
            this._name = name;
        }
        LoadJSONByNameTask.prototype.executeTaskHook = function () {
            this._url = ConfigManager.getInstance().getUrl(this._name);
            _super.prototype.executeTaskHook.call(this);
        };
        /**
         * @inheritDoc
         */
        LoadJSONByNameTask.prototype.destruct = function () {
            this._name = null;
            _super.prototype.destruct.call(this);
        };
        return LoadJSONByNameTask;
    })(LoadJSONTask);
    return LoadJSONByNameTask;
});
