var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask) {
    var WaitForReadyTask = (function (_super) {
        __extends(WaitForReadyTask, _super);
        function WaitForReadyTask() {
            _super.apply(this, arguments);
        }
        WaitForReadyTask.prototype.ready = function () {
            this.isReady = true;
            if (this.isExecuting()) {
                this.done();
            }
        };
        WaitForReadyTask.prototype.executeTaskHook = function () {
            if (this.isReady) {
                this.done();
            }
        };
        return WaitForReadyTask;
    })(AbstractTask);
    return WaitForReadyTask;
});
