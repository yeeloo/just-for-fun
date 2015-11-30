var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/createjs/easeljs/component/DisplayObject", "lib/createjs/easeljs/component/enum/ComponentType"], function (require, exports, DisplayObject, ComponentType) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container(width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = '50%'; }
            if (y === void 0) { y = '50%'; }
            if (regX === void 0) { regX = '50%'; }
            if (regY === void 0) { regY = '50%'; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 1 /* CONTAINER */;
            this.view = new createjs.Container();
            this.children = [];
            this._mouseOverEffectEnabled = false;
        }
        Container.prototype.setStage = function (stage) {
            if (!this._stage) {
                this._stage = stage;
                this.dispatchEvent('stageload');
                if (this.children.length > 0) {
                    var view;
                    for (var i = 0; i < this.children.length; i++) {
                        view = this.children[i];
                        if (view.type == 3 /* BUTTON */ || view.type == 1 /* CONTAINER */) {
                            view.setStage(stage);
                        }
                    }
                }
            }
        };
        Container.prototype.enableHitArea = function () {
            if (!this._hitarea) {
                this._hitarea = new createjs.Shape();
                this._hitarea.graphics.clear();
                this._hitarea.graphics.beginFill('#FFFFFF');
                this._hitarea.graphics.drawRect(0, 0, this.width, this.height);
                this.view.hitArea = this._hitarea;
            }
        };
        Container.prototype.enableMouseOverHandEffect = function () {
            var _this = this;
            if (!this._mouseOverEffectEnabled) {
                this._mouseOverEffectEnabled = true;
                if (this._stage) {
                    this.view.addEventListener('mouseover', this._stage.setMouseOver);
                    this.view.addEventListener('mouseout', this._stage.setMouseOut);
                }
                else {
                    _super.prototype.addEventListener.call(this, 'stageload', function () {
                        _this.view.addEventListener('mouseover', _this._stage.setMouseOver);
                        _this.view.addEventListener('mouseout', _this._stage.setMouseOut);
                    }, true);
                }
            }
        };
        Container.prototype.disableMouseOverHandEffect = function () {
            if (this._mouseOverEffectEnabled && this._stage) {
                this._mouseOverEffectEnabled = false;
                this.view.removeEventListener('mouseover', this._stage.setMouseOver);
                this.view.removeEventListener('mouseout', this._stage.setMouseOut);
            }
        };
        Container.prototype.add = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var view;
            for (var i = 0, l = args.length; i < l; i++) {
                view = args[i];
                if ((view.type == 3 /* BUTTON */ || view.type == 1 /* CONTAINER */) && this._stage) {
                    view['setStage'](this._stage);
                }
                this.children.push(view);
                this.view.addChild(view.view);
                view.onResize(this._size);
            }
        };
        Container.prototype.removeAll = function () {
            this.view.removeAllChildren();
            while (this.children.length > 0) {
                this.children.pop().destruct();
            }
        };
        Container.prototype.remove = function (child) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i] === child) {
                    this.children.splice(i, 1);
                    break;
                }
            }
            this.view.removeChild(child.view);
        };
        Container.prototype.onResize = function (e) {
            _super.prototype.onResize.call(this, e);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].onResize(this._size);
            }
            if (this._hitarea) {
                this._hitarea.graphics.clear();
                this._hitarea.graphics.beginFill('#FFFFFF');
                this._hitarea.graphics.drawRect(0, 0, this.width, this.height);
            }
        };
        Container.prototype.addEventListener = function (type, callback, single) {
            if (single === void 0) { single = false; }
            if (type == 'click' || type == 'mouseover' || type == 'mouseout' || type == 'mousedown' || type == 'mouseup') {
                this.enableHitArea();
                this.view.addEventListener(type, callback);
            }
            else {
                _super.prototype.addEventListener.call(this, type, callback, single);
            }
        };
        Container.prototype.hide = function () {
            this.view.visible = false;
        };
        Container.prototype.show = function () {
            this.view.visible = true;
        };
        Container.prototype.destruct = function () {
            this.removeAllEventListeners();
            this.removeAll();
            _super.prototype.destruct.call(this);
        };
        return Container;
    })(DisplayObject);
    return Container;
});
