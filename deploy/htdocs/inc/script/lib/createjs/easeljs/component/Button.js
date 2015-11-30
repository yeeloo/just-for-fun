var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/createjs/easeljs/component/enum/ComponentType", "lib/createjs/easeljs/component/Container", "lib/createjs/easeljs/component/Image"], function (require, exports, ComponentType, Container, Image) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(src, width, height, x, y, regX, regY) {
            if (x === void 0) { x = '50%'; }
            if (y === void 0) { y = '50%'; }
            if (regX === void 0) { regX = '50%'; }
            if (regY === void 0) { regY = '50%'; }
            _super.call(this);
            this.type = 3 /* BUTTON */;
            this.img = new Image(src, 'inherit', 'inherit', 0, 0, 0, 0);
            this.setWidth(width);
            this.setHeight(height);
            this.setX(x);
            this.setY(y);
            this.setRegX(regX);
            this.setRegY(regY);
            this.add(this.img);
            this.view.mouseChildren = false;
        }
        Button.prototype.setStage = function (stage) {
            if (!this._stage) {
                this.addEventListener('mouseover', stage.setMouseOver);
                this.addEventListener('mouseout', stage.setMouseOut);
            }
            _super.prototype.setStage.call(this, stage);
        };
        Button.prototype.destruct = function () {
            this.img = null;
            this._stage = null;
            _super.prototype.destruct.call(this);
        };
        return Button;
    })(Container);
    return Button;
});
