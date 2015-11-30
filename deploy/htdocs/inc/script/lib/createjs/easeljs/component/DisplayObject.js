var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/createjs/easeljs/component/EventDispatcher', 'lib/createjs/easeljs/component/enum/ComponentType', 'lib/createjs/easeljs/component/enum/CalculationType', 'lib/createjs/easeljs/component/CalculationComponent'], function (require, exports, EventDispatcher, ComponentType, CalculationType, CalculationComponent) {
    /**
     * @name DisplayObject
     * @author Mient-jan Stelling
     * @abstract
     */
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject(width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this);
            this.type = 0 /* UNKNOWN */;
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.regX = 0;
            this.regY = 0;
            this._scaleToFitContainer = false;
            /**
             * @protected
             */
            this.scaleX = 1;
            /**
             * @protected
             */
            this.scaleY = 1;
            this.updateOnResize = true;
            this.updateWidthOnResize = true;
            this.updateHeightOnResize = true;
            this.updateXOnResize = true;
            this.updateYOnResize = true;
            this.updateRegXOnResize = true;
            this.updateRegYOnResize = true;
            // @protected
            this._containerSizeKnown = false;
            this._containerSize = {
                width: 0,
                height: 0
            };
            this._size = {
                width: 0,
                height: 0
            };
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            this.setWidth(width);
            this.setHeight(height);
            this.setRegX(regX);
            this.setRegY(regY);
            this.setX(x);
            this.setY(y);
        }
        DisplayObject.prototype.storeUpdateOnData = function () {
            this._storeUpdateOnResize = this.updateOnResize;
            this._storeUpdateWidthOnResize = this.updateWidthOnResize;
            this._storeUpdateHeightOnResize = this.updateHeightOnResize;
            this._storeUpdateRegXOnResize = this.updateRegXOnResize;
            this._storeUpdateRegYOnResize = this.updateRegYOnResize;
            this._storeUpdateXOnResize = this.updateXOnResize;
            this._storeUpdateYOnResize = this.updateYOnResize;
        };
        DisplayObject.prototype.restoreUpdateOnData = function () {
            this.updateOnResize = this._storeUpdateOnResize;
            this.updateWidthOnResize = this._storeUpdateWidthOnResize;
            this.updateHeightOnResize = this._storeUpdateHeightOnResize;
            this.updateRegXOnResize = this._storeUpdateRegXOnResize;
            this.updateRegYOnResize = this._storeUpdateRegYOnResize;
            this.updateXOnResize = this._storeUpdateXOnResize;
            this.updateYOnResize = this._storeUpdateYOnResize;
        };
        DisplayObject.prototype.disableAllX = function () {
            this.updateHeightOnResize = this.updateYOnResize = this.updateRegYOnResize = false;
        };
        DisplayObject.prototype.disableAllY = function () {
            this.updateWidthOnResize = this.updateXOnResize = this.updateRegXOnResize = false;
        };
        DisplayObject.prototype.setWidth = function (width) {
            if (typeof (width) == 'string') {
                if (width.substr(-1) == '%') {
                    this._width = parseFloat(width.substr(0, width.length - 1)) / 100;
                    this._width_type = 1 /* FLUID */;
                }
                else {
                    this._width = CalculationComponent.dissolveCalcElements(width);
                    this._width_type = 3 /* CALC */;
                }
            }
            else {
                this.width = width;
                this._width_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllY();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setHeight = function (height) {
            if (typeof (height) == 'string') {
                // @todo check if only procent unit.
                if (height.substr(-1) == '%') {
                    this._height = parseFloat(height.substr(0, height.length - 1)) / 100;
                    this._height_type = 1 /* FLUID */;
                }
                else {
                    this._height = CalculationComponent.dissolveCalcElements(height);
                    this._height_type = 3 /* CALC */;
                }
            }
            else {
                this.height = height;
                this._height_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllX();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setX = function (x) {
            if (typeof (x) == 'string') {
                if (x.substr(-1) == '%') {
                    this._x = parseFloat(x.substr(0, x.length - 1)) / 100;
                    this._x_type = 1 /* FLUID */;
                }
                else {
                    this._x = CalculationComponent.dissolveCalcElements(x);
                    this._x_type = 3 /* CALC */;
                }
            }
            else {
                this.x = x;
                this._x_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllY();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setY = function (y) {
            if (typeof (y) == 'string') {
                if (y.substr(-1) == '%') {
                    this._y = parseFloat(y.substr(0, y.length - 1)) / 100;
                    this._y_type = 1 /* FLUID */;
                }
                else {
                    this._y = CalculationComponent.dissolveCalcElements(y);
                    this._y_type = 3 /* CALC */;
                }
            }
            else {
                this.y = y;
                this._y_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllX();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setRegX = function (x) {
            if (typeof (x) == 'string') {
                if (x.substr(-1) == '%') {
                    this._regX = parseFloat(x.substr(0, x.length - 1)) / 100;
                    this._regX_type = 1 /* FLUID */;
                }
                else {
                    this._regX = CalculationComponent.dissolveCalcElements(x);
                    this._regX_type = 3 /* CALC */;
                }
            }
            else {
                this.regX = x;
                this._regX_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllY();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setRegY = function (y) {
            if (typeof (y) == 'string') {
                if (y.substr(-1) == '%') {
                    this._regY = parseFloat(y.substr(0, y.length - 1)) / 100;
                    this._regY_type = 1 /* FLUID */;
                }
                else {
                    this._regY = CalculationComponent.dissolveCalcElements(y);
                    this._regY_type = 3 /* CALC */;
                }
            }
            else {
                this.regY = y;
                this._regY_type = 2 /* STATIC */;
            }
            if (this._containerSizeKnown) {
                this.storeUpdateOnData();
                this.disableAllX();
                this.onResize(this._containerSize);
                this.restoreUpdateOnData();
            }
            return this;
        };
        DisplayObject.prototype.setTransform = function (w, h, x, y, rx, ry) {
            var isKnown = this._containerSizeKnown;
            if (this._containerSizeKnown) {
                this._containerSizeKnown = false;
            }
            if (x != null)
                this.setX(x);
            if (y != null)
                this.setY(y);
            if (w != null)
                this.setWidth(w);
            if (h != null)
                this.setHeight(h);
            if (rx != null)
                this.setRegX(rx);
            if (ry != null)
                this.setRegY(ry);
            if (isKnown) {
                this._containerSizeKnown = isKnown;
                this.onResize(this._containerSize);
            }
            return this;
        };
        DisplayObject.prototype.onResize = function (e) {
            this._containerSize.width = e.width;
            this._containerSize.height = e.height;
            if (this.updateOnResize) {
                if (this.updateWidthOnResize && this._width_type == 1 /* FLUID */) {
                    this.width = this._width * e.width;
                }
                else if (this._width_type == 3 /* CALC */) {
                    this.width = CalculationComponent.calcUnit(e.width, this._width);
                }
                if (this.updateHeightOnResize && this._height_type == 1 /* FLUID */) {
                    this.height = this._height * e.height;
                }
                else if (this._height_type == 3 /* CALC */) {
                    this.height = CalculationComponent.calcUnit(e.height, this._height);
                }
                if (this.updateRegXOnResize && this._regX_type == 1 /* FLUID */) {
                    this.regX = this._regX * this.width;
                    this.view.regX = this.regX;
                }
                else if (this._regX_type == 3 /* CALC */) {
                    this.regX = CalculationComponent.calcUnit(this.width, this._regX);
                    this.view.regX = this.regX;
                }
                if (this.updateRegYOnResize && this._regY_type == 1 /* FLUID */) {
                    this.regY = this._regY * this.height;
                    this.view.regY = this.regY;
                }
                else if (this.updateRegYOnResize && this._regY_type == 3 /* CALC */) {
                    this.regY = CalculationComponent.calcUnit(this.height, this._height);
                    this.view.regY = this.regY;
                }
                if (this.updateXOnResize && this._x_type == 1 /* FLUID */) {
                    this.x = Math.round(this._x * e.width);
                    this.view.x = this.x;
                }
                else if (this.updateXOnResize && this._x_type == 3 /* CALC */) {
                    this.x = Math.round(CalculationComponent.calcUnit(e.width, this._x));
                    this.view.x = this.x;
                }
                if (this.updateYOnResize && this._y_type == 1 /* FLUID */) {
                    this.y = Math.round(this._y * e.height);
                    this.view.y = this.y;
                }
                else if (this.updateYOnResize && this._y_type == 3 /* CALC */) {
                    this.y = Math.round(CalculationComponent.calcUnit(e.height, this._y));
                    this.view.y = this.y;
                }
                if (this._scaleToFitContainer) {
                    this.view.scaleX = this.view.scaleY = this.scaleX = this.scaleY = Math.max(e.width / this.width, e.height / this.height);
                }
            }
            this._size.width = this.width;
            this._size.height = this.height;
        };
        return DisplayObject;
    })(EventDispatcher);
    return DisplayObject;
});
