var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/createjs/easeljs/component/DisplayObject", "lib/createjs/easeljs/component/enum/ComponentType", "lib/temple/net/ResourceManager"], function (require, exports, DisplayObject, ComponentType, ResourceManager) {
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image(src, width, height, x, y, regX, regY, keepRatio) {
            var _this = this;
            if (width === void 0) { width = 'inherit'; }
            if (height === void 0) { height = 'inherit'; }
            if (x === void 0) { x = '50%'; }
            if (y === void 0) { y = '50%'; }
            if (regX === void 0) { regX = '50%'; }
            if (regY === void 0) { regY = '50%'; }
            if (keepRatio === void 0) { keepRatio = true; }
            _super.call(this);
            this.src = src;
            this.keepRatio = keepRatio;
            this.type = 2 /* IMAGE */;
            this.loaded = false;
            this.widthInherit = false;
            this.heightInherit = false;
            if (width != 'inherit') {
                this.setWidth(width);
            }
            else {
                this.widthInherit = true;
            }
            if (height != 'inherit') {
                this.setHeight(height);
            }
            else {
                this.heightInherit = true;
            }
            this.setRegX(regX);
            this.setRegY(regY);
            this.setX(x);
            this.setY(y);
            var img = ResourceManager.getImageElement(src, function () {
                _this.loaded = true;
                if (_this._resizeTmp) {
                    _this.onResize(_this._resizeTmp);
                }
            });
            this.view = new createjs.Bitmap(img);
            this.view.x = this.x;
            this.view.y = this.y;
        }
        Image.prototype.addEventListener = function (type, listener) {
            if (type == 'click' || type == 'mouseover' || type == 'mouse') {
                this.view.addEventListener(type, listener);
            }
            _super.prototype.addEventListener.call(this, type, listener);
        };
        Image.prototype.onResize = function (e) {
            if (this.loaded) {
                if (this.widthInherit) {
                    this.setWidth(this.view.image.width);
                }
                if (this.heightInherit) {
                    this.setHeight(this.view.image.height);
                }
            }
            this._resizeTmp = e;
            if (this.loaded) {
                _super.prototype.onResize.call(this, e);
                this.view.scaleX = Math.max(this.width / this.view.image.width, this.height / this.view.image.height);
                this.view.scaleY = Math.max(this.height / this.view.image.height, this.height / this.view.image.height);
                if (this.keepRatio) {
                    this.view.scaleX = Math.max(this.view.scaleX, this.view.scaleY);
                    this.view.scaleY = Math.max(this.view.scaleX, this.view.scaleY);
                }
                if (typeof (this._regX) != 'undefined') {
                    this.view.regX = this.view.image.width * this._regX;
                }
                if (typeof (this._regY) != 'undefined') {
                    this.view.regY = this.view.image.height * this._regY;
                }
            }
            this.view.x = this.x;
            this.view.y = this.y;
        };
        Image.prototype.destruct = function () {
            this.view.removeAllEventListeners();
            _super.prototype.destruct.call(this);
        };
        return Image;
    })(DisplayObject);
    return Image;
});
