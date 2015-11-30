var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/createjs/easeljs/component/EventDispatcher', 'lib/createjs/easeljs/component/enum/CalculationUnitType'], function (require, exports, EventDispatcher, CalculationUnitType) {
    /**
     * @name CalculationComponent
     * @author Mient-jan Stelling
     */
    var CalculationComponent = (function (_super) {
        __extends(CalculationComponent, _super);
        function CalculationComponent() {
            _super.apply(this, arguments);
        }
        CalculationComponent.dissolveCalcElements = function (statement) {
            statement = statement.replace('*', ' * ').replace('/', ' / ');
            var arr = statement.split(CalculationComponent._spaceSplit);
            var calculationElements = [];
            for (var i = 0; i < arr.length; i++) {
                var d = CalculationComponent.dissolveElement(arr[i]);
                calculationElements.push(d);
            }
            return calculationElements;
        };
        CalculationComponent.dissolveElement = function (val) {
            var index = CalculationComponent._unitypeString.indexOf(val);
            if (index >= 0) {
                return CalculationComponent._unittype[index];
            }
            var o = {};
            var match = CalculationComponent._valueUnitDisolvement.exec(val);
            if (match) {
                var v = match.length >= 2 ? match[1] : match[0];
                o.value = CalculationComponent.toFloat(v); // value > float
                o.unit = match.length >= 3 ? match[2] : '';
            }
            else {
                o = { value: val, unit: null };
            }
            return o;
        };
        /**
         *
         * @param size
         * @param data
         * @returns {number}
         */
        CalculationComponent.calcUnit = function (size, data) {
            var sizea = CalculationComponent.getCalcUnitSize(size, data[0]);
            for (var i = 2, l = data.length; i < l; i = i + 2) {
                sizea = CalculationComponent.getCalcUnit(sizea, data[i - 1], CalculationComponent.getCalcUnitSize(size, data[i]));
            }
            return sizea;
        };
        /**
         * Calculates arithmetic on 2 units.
         *
         * @author Mient-jan Stelling
         * @param unit1
         * @param math
         * @param unit2
         * @returns number;
         */
        CalculationComponent.getCalcUnit = function (unit1, math, unit2) {
            switch (math) {
                case 0 /* ADDITION */:
                    {
                        return unit1 + unit2;
                        break;
                    }
                case 1 /* SUBSTRACTION */:
                    {
                        return unit1 - unit2;
                        break;
                    }
                case 2 /* MULTIPLICATION */:
                    {
                        return unit1 * unit2;
                        break;
                    }
                case 3 /* DIVISION */:
                    {
                        return unit1 / unit2;
                        break;
                    }
                default:
                    {
                        return 0;
                        break;
                    }
            }
        };
        /**
         *
         * @todo add support for more unit types.
         *
         * @author Mient-jan Stelling
         * @param size
         * @param data
         * @returns {number}
         */
        CalculationComponent.getCalcUnitSize = function (size, data) {
            switch (data.unit) {
                case '%':
                    {
                        return size * (data.value / 100);
                        break;
                    }
                default:
                    {
                        return data.value;
                        break;
                    }
            }
        };
        CalculationComponent.toFloat = function (value) {
            return parseFloat(value) || 0.0;
        };
        /**
         *
         */
        CalculationComponent._unittype = [0 /* ADDITION */, 1 /* SUBSTRACTION */, 2 /* MULTIPLICATION */, 3 /* DIVISION */];
        CalculationComponent._unitypeString = '+-*/';
        CalculationComponent._valueUnitDisolvement = /([\+\-]?[0-9\.]+)(%|px|pt|em|in|cm|mm|ex|pc|vw)?/;
        CalculationComponent._spaceSplit = /\s+/;
        return CalculationComponent;
    })(EventDispatcher);
    return CalculationComponent;
});
