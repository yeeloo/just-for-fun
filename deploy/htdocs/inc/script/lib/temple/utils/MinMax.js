define(["require", "exports"], function (require, exports) {
    /**
     *         MinMax
     *
     *         lazy min/max number values util (easy randomizer/limiter etc)
     *
     * @author Bart (bart[at]mediamonks.com)
     *
     */
    var MinMax = (function () {
        function MinMax(min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            this._min = 0;
            this._max = 1;
            this._range = 1;
            this._min = min;
            this._max = max;
            this.order();
        }
        MinMax.prototype.getRandom = function () {
            return this._range * Math.random() + this._min;
        };
        MinMax.prototype.getRange = function () {
            return this._range;
        };
        MinMax.prototype.getCenter = function () {
            return this._range / 2 + this._min;
        };
        MinMax.prototype.getMin = function () {
            return this._min;
        };
        MinMax.prototype.setMin = function (value) {
            this._min = value;
            this.order();
        };
        MinMax.prototype.getMax = function () {
            return this._max;
        };
        MinMax.prototype.setMax = function (value) {
            this._max = value;
            this.order();
        };
        MinMax.prototype.limit = function (value) {
            if (value < this._min) {
                value = this._min;
            }
            else if (value > this._max) {
                value = this._max;
            }
            return value;
        };
        MinMax.prototype.contains = function (value) {
            if (value < this._min || value > this._max) {
                return false;
            }
            return true;
        };
        MinMax.prototype.order = function () {
            if (this._min > this._max) {
                var tmp = this._min;
                this._min = this._max;
                this._max = tmp;
            }
            this._range = this._max - this._min; //allways do this
        };
        return MinMax;
    })();
    return MinMax;
});
