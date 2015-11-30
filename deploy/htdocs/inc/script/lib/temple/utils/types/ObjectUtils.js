define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some functions for Objects.
     *
     * @author Thijs Broerse
     */
    var ObjectUtils = (function () {
        function ObjectUtils() {
        }
        /**
         * Checks if the value is a primitive (String, Number, or Boolean)
         */
        ObjectUtils.isPrimitive = function (value) {
            if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean' || value == null) {
                return true;
            }
            return false;
        };
        /**
         * Checks if the object has (one or more) values
         */
        ObjectUtils.hasValues = function (object) {
            if (object instanceof Array)
                return object.length > 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Counts the number of elements in an Object
         */
        ObjectUtils.getLength = function (object) {
            var count = 0;
            for (var key in object) {
                count++;
            }
            return count;
        };
        /**
         * Get the keys of an object.
         * @return an Array of all the keys
         */
        ObjectUtils.getKeys = function (object) {
            var keys = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        /**
         * Get the values of an object.
         * @return an Array of all values.
         */
        ObjectUtils.getValues = function (object) {
            var values = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    values.push(object[key]);
                }
            }
            return values;
        };
        /**
         * Check if there are properties defined
         * @return true if we have properties
         */
        ObjectUtils.hasKeys = function (object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Returns an inverted object with all values as key and keys as value.
         */
        ObjectUtils.invert = function (object) {
            var inverted = {};
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    inverted[object[key]] = key;
                }
            }
            return inverted;
        };
        /**
         * Converts an object to an other class
         *
         * @param object
         * @param toClass
         */
        ObjectUtils.convert = function (object, toClass) {
            for (var property in toClass.prototype) {
                if (property in toClass.prototype) {
                    object[property] = toClass.prototype[property];
                }
            }
            object.__proto__ = new (toClass)();
        };
        /**
         * Removes all properties of an object
         *
         * @param object
         */
        ObjectUtils.clear = function (object) {
            for (var property in object) {
                delete object[property];
            }
        };
        return ObjectUtils;
    })();
    return ObjectUtils;
});
