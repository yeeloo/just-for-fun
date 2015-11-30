define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some functions for Numbers.
     *
     * @author Thijs Broerse, Arjan van Wijk, Bart van der Schoor
     */
    var NumberUtils = (function () {
        function NumberUtils() {
        }
        /**
         * Creates a random number within a given range.
         * @param start lowest number of the range
         * @param end highest number of the range
         * @return A new random number.
         * @example
         * This example creates a random number between 10 and 20:
         * <listing version="3.0">
         * var scale:Number = NumberUtils.randomInRange(10, 20);
         * </listing>
         */
        NumberUtils.randomInRange = function (start, end) {
            var d = end - start;
            return start + (d - Math.random() * d);
        };
        /**
         * Finds the relative position of a number in a range between min and max, and returns its normalized value between 0 and 1.
         * @param number value to normalize
         * @param min lowest range value
         * @param max highest range value
         * @return The normalized value between 0 and 1.
         * @example
         * <listing version="3.0">
         *    NumberUtils.normalizedValue(25, 0, 100); // 0.25
         *    NumberUtils.normalizedValue(0, -1, 1); // 0.5
         * </listing>
         */
        NumberUtils.normalizedValue = function (value, min, max) {
            var diff = max - min;
            if (diff == 0) {
                return min;
            }
            var f = 1 / diff;
            return f * (value - min);
        };
        /**
         * Calculates the angle of a vector.
         * @param dx the x component of the vector
         * @param dy the y component of the vector
         * @return The the angle of the passed vector in degrees.
         */
        NumberUtils.angle = function (dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        };
        /**
         * Determines a value between two specified values.
         *
         * @param amount: The level of interpolation between the two values. If {@code 0%}, {@code begin} value is returned; if {@code 100%}, {@code end} value is returned.
         * @param minimum: The lower value.
         * @param maximum: The upper value.
         * @example
         * <listing version="3.0">
         *    trace(NumberUtil.interpolate(0.5, 0, 10)); // Traces 5
         * </listing>
         */
        NumberUtils.interpolate = function (factor, minimum, maximum) {
            return minimum + (maximum - minimum) * factor;
        };
        /**
         * Formats a number to a specific format.
         * @param number the number to format
         * @param thousandDelimiter the characters used to delimit thousands, millions, etcetera; "." if not specified
         * @param decimalDelimiter the characters used to delimit the fractional portion from the whole number; "," if not specified
         * @param precision the total number of decimals
         * @param fillLength  minimal length of the part *before* the decimals delimiter, if the length is less it will be filled up
         * @param fillChar the character to use to fill with; zero ("0") if not specified
         */
        NumberUtils.format = function (value, decimalDelimiter, thousandDelimiter, precision, fillLength, fillChar) {
            if (decimalDelimiter === void 0) { decimalDelimiter = ','; }
            if (thousandDelimiter === void 0) { thousandDelimiter = '.'; }
            if (precision === void 0) { precision = NaN; }
            if (fillLength === void 0) { fillLength = NaN; }
            if (fillChar === void 0) { fillChar = '0'; }
            if (!isNaN(precision)) {
                value = NumberUtils.roundToPrecision(value, precision);
            }
            var str = value.toString();
            var p = str.indexOf('.');
            if (value < 0) {
                str = str.substr(1);
            }
            var decimals = p != -1 ? str.substr(p + 1) : '';
            while (decimals.length < precision) {
                decimals = decimals + '0';
            }
            var floored = Math.floor(Math.abs(value)).toString();
            var formatted = '';
            if (thousandDelimiter) {
                var len = Math.ceil(floored.length / 3) - 1;
                for (var i = 0; i < len; ++i) {
                    formatted = thousandDelimiter + floored.substr(floored.length - (3 * (i + 1)), 3) + formatted;
                }
                formatted = floored.substr(0, floored.length - (3 * i)) + formatted;
            }
            else {
                formatted = floored;
            }
            if (fillLength && fillChar && fillChar != '') {
                if (value < 0) {
                    fillLength--;
                }
                while (formatted.length < fillLength) {
                    formatted = fillChar + formatted;
                }
            }
            if (isNaN(precision) || precision > 0) {
                formatted = formatted + (decimals ? decimalDelimiter + decimals : '');
            }
            if (value < 0) {
                formatted = '-' + formatted;
            }
            return formatted;
        };
        /**
         * Rounds a number to a certain level of precision. Useful for limiting the number of decimal places on a fractional number.
         *
         * @param number the input number to round.
         * @param precision    the number of decimal digits to keep
         * @return the rounded number, or the original input if no rounding is needed
         */
        NumberUtils.roundToPrecision = function (value, precision) {
            if (precision === void 0) { precision = 0; }
            var n = Math.pow(10, precision);
            return Math.round(value * n) / n;
        };
        /**
         * Floors a number to a certain level of precision. Useful for limiting the number of
         * decimal places on a fractional number.
         *
         * @param number the input number to floor.
         * @param precision    the number of decimal digits to keep
         * @return the floored number, or the original input if no flooring is needed
         */
        NumberUtils.floorToPrecision = function (value, precision) {
            if (precision === void 0) { precision = 0; }
            var n = Math.pow(10, precision);
            return Math.floor(value * n) / n;
        };
        /**
         * Rounds a Number to the nearest multiple of an input. For example, by rounding
         * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
         *
         * @param number the number to round
         * @param nearest the number whose multiple must be found
         * @return the rounded number
         */
        NumberUtils.roundToNearest = function (value, nearest) {
            if (nearest === void 0) { nearest = 1; }
            if (nearest == 0) {
                return value;
            }
            var roundedNumber = Math.round(NumberUtils.roundToPrecision(value / nearest, 10)) * nearest;
            return NumberUtils.roundToPrecision(roundedNumber, 10);
        };
        /**
         * Rounds a Number <em>up</em> to the nearest multiple of an input. For example, by rounding
         * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
         *
         * @param number the number to round up
         * @param nearest the number whose multiple must be found
         * @return the rounded number
         */
        NumberUtils.roundUpToNearest = function (value, nearest) {
            if (nearest === void 0) { nearest = 1; }
            if (nearest == 0) {
                return value;
            }
            return Math.ceil(NumberUtils.roundToPrecision(value / nearest, 10)) * nearest;
        };
        /**
         * Rounds a Number <em>down</em> to the nearest multiple of an input. For example, by rounding
         * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
         *
         * @param number the number to round down
         * @param nearest the number whose multiple must be found
         * @return the rounded number
         */
        NumberUtils.roundDownToNearest = function (value, nearest) {
            if (nearest === void 0) { nearest = 1; }
            if (nearest == 0) {
                return value;
            }
            return Math.floor(NumberUtils.roundToPrecision(value / nearest, 10)) * nearest;
        };
        /**
         * Ceils a number to a certain level of precision. Useful for limiting the number of
         * decimal places on a fractional number.
         *
         * @param number the input number to ceil.
         * @param precision    the number of decimal digits to keep
         * @return the ceiled number, or the original input if no ceiling is needed
         */
        NumberUtils.ceilToPrecision = function (value, precision) {
            if (precision === void 0) { precision = 0; }
            var n = Math.pow(10, precision);
            return Math.ceil(value * n) / n;
        };
        /**
         * Tests equality for numbers that may have been generated by faulty floating point math.
         * This is not an issue exclusive to the Flash Player, but all modern computing in general.
         * The value is generally offset by an insignificant fraction, and it may be corrected.
         *
         * <p>Alternatively, this function could be used for other purposes than to correct floating
         * point errors. Certainly, it could determine if two very large numbers are within a certain
         * range of difference. This might be useful for determining "ballpark" estimates or similar
         * statistical analysis that may not need complete accuracy.</p>
         *
         * @param number1 the first number to test
         * @param number2 the second number to test
         * @param precision    the number of digits in the fractional portion to keep
         * @return true, if the numbers are close enough to be considered equal, false if not.
         */
        NumberUtils.fuzzyEquals = function (number1, number2, precision) {
            if (precision === void 0) { precision = 5; }
            var difference = number1 - number2;
            var range = Math.pow(10, -precision);
            //default precision checks the following:
            //0.00001 < difference > -0.00001
            return difference < range && difference > -range;
        };
        /**
         * Clamp a number to a range around zero (from -range to +range)
         */
        NumberUtils.clampPosNeg = function (input, range, base) {
            if (base === void 0) { base = 0; }
            range = Math.abs(range);
            input -= base;
            if (input < 0 && input < -range) {
                return base - range;
            }
            else if (input > 0 && input > range) {
                return base + range;
            }
            return base + input;
        };
        /**
         * Get the Number out of a string. Can handle . or , as decimal separator (will not match thousand delimitters)
         * Useful for unit values like '€ 49.95' or '1000 KM'
         */
        NumberUtils.getNumberFromString = function (value) {
            value = value.match(/[0-9]+[.,]?[0-9]*/)[0];
            // replace , fo .
            value = value.replace(',', '.');
            return parseFloat(value);
        };
        /**
         * Get English suffix for an ordinal number: 1 -> 'st' ('1st'), 2 -> 'nd' ('2nd'), 3 -> 'rd' ('3rd'), 4 -> 'th' ('4th')
         */
        NumberUtils.ordinalSuffix = function (position) {
            if (position < 0) {
                throw 'ordinal number less then zero';
            }
            switch (position) {
                case 0:
                    return '';
                case 11:
                case 12:
                case 13:
                    return 'th';
            }
            //rule
            var rest = position % 10;
            switch (rest) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
            }
            return 'th';
        };
        /**
         * Calculates the smallest possible difference between 2 indexes.
         * @param index the current index
         * @param newIndex the new index
         * @param total the range to do 'modulo'
         */
        NumberUtils.getNearestRotationIndex = function (index, newIndex, total) {
            if (total === void 0) { total = 360; }
            var curIndex = index;
            while (curIndex < 0)
                curIndex += total;
            while (newIndex < 0)
                newIndex += total;
            var diff = Math.abs(curIndex - newIndex);
            if (diff > total / 2) {
                if (curIndex > newIndex) {
                    return index + (total - diff);
                }
                else {
                    return index - (total - diff);
                }
            }
            else {
                if (curIndex < newIndex) {
                    return index + diff;
                }
                else {
                    return index - diff;
                }
            }
        };
        return NumberUtils;
    })();
    return NumberUtils;
});
