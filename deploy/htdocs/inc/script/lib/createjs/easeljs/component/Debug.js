var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/createjs/easeljs/component/Container", "lib/createjs/easeljs/component/enum/ComponentType"], function (require, exports, Container, ComponentType) {
    var Debug = (function (_super) {
        __extends(Debug, _super);
        function Debug(name, width, height, x, y, regX, regY) {
            if (name === void 0) { name = 'unknown'; }
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = '0%'; }
            if (y === void 0) { y = '0%'; }
            if (regX === void 0) { regX = '0%'; }
            if (regY === void 0) { regY = '0%'; }
            _super.call(this);
            this.name = name;
            this.type = 6 /* DEBUG */;
            this._shape = new createjs.Shape();
            this._text = new createjs.Text('', 'bold 16px Arial');
            this._clickable = false;
            this.setWidth(width);
            this.setHeight(height);
            this.setRegX(regX);
            this.setRegY(regY);
            this.setX(x);
            this.setY(y);
            this._text.textAlign = 'center';
            this._text.textBaseline = 'center';
            this.view.addChild(this._shape);
            this.view.addChild(this._text);
            this.view.mouseEnabled = false;
            this.update();
        }
        Debug.prototype.update = function () {
            if (this.width > 0 && this.height > 0) {
                this._text.text = (this.name.length > 0 ? this.name + '\n' : '') + Math.round(this.width) + ' x ' + Math.round(this.height);
                this._text.x = this.width / 2;
                this._text.y = this.height / 2;
                if (this.width < 100 || this.height < 100) {
                    this._text.visible = false;
                }
                this._shape.graphics.clear();
                this._shape.graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
                this._shape.graphics.setStrokeStyle(1);
                if (this._hitarea) {
                    this._hitarea.graphics.clear();
                    this._hitarea.graphics.beginFill('#FFFFFF');
                    this._hitarea.graphics.drawRect(0, 0, this.width, this.height);
                }
                this._shape.graphics.drawRect(0, 0, this.width, this.height);
                this._shape.graphics.setStrokeStyle(1);
                this._shape.graphics.moveTo(10, 10);
                this._shape.graphics.lineTo(this.width - 10, this.height - 10);
                this._shape.graphics.moveTo(this.width - 10, 10);
                this._shape.graphics.lineTo(10, this.height - 10);
                //			this._shape.graphics.beginFill('#FFFFFF');
                this._shape.graphics.drawRect(this.width / 2 - 50, this.height / 2 - 20, 100, 40);
                this.view.y = this.y;
                this.view.x = this.x;
                this.view.regX = this.regX;
                this.view.regY = this.regY;
            }
        };
        Debug.prototype.addEventListener = function (type, listener) {
            if (type == 'click') {
                this._clickable = true;
                this._hitarea = new createjs.Shape();
                this._hitarea.visible = true;
                this.view.hitArea = this._hitarea;
                //			this.view.addChild(this._hitarea);
                this.update();
                this.view.addEventListener(type, listener);
            }
            _super.prototype.addEventListener.call(this, type, listener);
        };
        Debug.prototype.onResize = function (e) {
            console.log(e);
            _super.prototype.onResize.call(this, e);
            this.update();
        };
        return Debug;
    })(Container);
    return Debug;
});
