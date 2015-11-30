var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../lib/temple/core/Destructible'], function (require, exports, Destructible) {
    var ColliderCanvas = (function (_super) {
        __extends(ColliderCanvas, _super);
        function ColliderCanvas(view) {
            _super.call(this);
            this.element = view;
            this.initialize();
        }
        ColliderCanvas.prototype.initialize = function () {
        };
        ColliderCanvas.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return ColliderCanvas;
    })(Destructible);
    return ColliderCanvas;
});
