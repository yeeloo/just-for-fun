var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask) {
    var MethodTask = (function (_super) {
        __extends(MethodTask, _super);
        /**
         * @param method the method that will be called when executing this task.
         * @param arguments any number of arguments that will be passed to the callback function when it is called.
         */
        function MethodTask(method, arguments) {
            if (arguments === void 0) { arguments = null; }
            _super.call(this);
            this._method = method;
            this._arguments = arguments;
        }
        MethodTask.prototype.getMethod = function () {
            return this._method.toString();
        };
        MethodTask.prototype.executeTaskHook = function () {
            this._method.apply(null, this._arguments ? this._arguments : []);
            this.done();
        };
        /**
         * @inheritDoc
         */
        MethodTask.prototype.destruct = function () {
            this._method = null;
            this._arguments = null;
            _super.prototype.destruct.call(this);
        };
        return MethodTask;
    })(AbstractTask);
    return MethodTask;
});
