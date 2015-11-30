define(["require", "exports"], function (require, exports) {
    /**
     * Type will return the following strings
     *
     *  - Type.TYPE_STRING
     *  - Type.TYPE_NAN
     *  - Type.TYPE_NULL
     *  - Type.TYPE_UNDEFINED
     *  - Type.TYPE_NUMBER
     *  - Type.TYPE_ARRAY
     *  - Type.TYPE_ARGUMENTS
     *  - Type.TYPE_ELEMENT
     *  - Type.TYPE_TEXTNODE
     *  - Type.TYPE_WHITESPACE
     *  - Type.TYPE_FUNCTION
     *  - Type.TYPE_BOOLEAN
     *  - Type.TYPE_OBJECT
     *
     * @function Type
     * @param {*} item
     * @returns {string}
     * @constructor
     */
    var Type = function (value) {
        var valueTypeOf = typeof (value);
        if (valueTypeOf == 'string') {
            return Type.TYPE_STRING;
        }
        if (valueTypeOf == 'boolean') {
            return Type.TYPE_BOOLEAN;
        }
        if (Type.isNULL(value)) {
            return Type.TYPE_NULL;
        }
        if (Type.isNaN(value)) {
            return Type.TYPE_NAN;
        }
        if (valueTypeOf == 'number') {
            return Type.TYPE_NUMBER;
        }
        if (valueTypeOf == void 0) {
            return Type.TYPE_UNDEFINED;
        }
        if (typeof value.length == 'number') {
            if (Type.isArguments(value)) {
                return Type.TYPE_ARGUMENTS;
            }
            if (Type.isArray(value)) {
                return Type.TYPE_ARRAY;
            }
        }
        if (value.nodeName) {
            if (value.nodeType == 1) {
                return Type.TYPE_ELEMENT;
            }
            if (value.nodeType == 3) {
                return (/\S/).test(value.nodeValue) ? Type.TYPE_TEXTNODE : Type.TYPE_WHITESPACE;
            }
        }
        if (Type.isFunction(value)) {
            return Type.TYPE_FUNCTION;
        }
        if (Type.isDate(value)) {
            return Type.TYPE_DATE;
        }
        if (Type.isObject(value)) {
            return Type.TYPE_OBJECT;
        }
        throw new Error('unknown type ' + valueTypeOf);
    };
    Type.TYPE_STRING = 'string';
    Type.TYPE_ARRAY = 'array';
    Type.TYPE_FUNCTION = 'function';
    Type.TYPE_INTEGER = 'integer';
    Type.TYPE_FLOAT = 'float';
    Type.TYPE_DATE = 'date';
    Type.TYPE_BOOLEAN = 'boolean';
    Type.TYPE_NAN = 'NaN';
    Type.TYPE_NULL = 'null';
    Type.TYPE_UNDEFINED = 'undefined';
    Type.TYPE_NUMBER = 'number';
    Type.TYPE_ARGUMENTS = 'arguments';
    Type.TYPE_ELEMENT = 'element';
    Type.TYPE_TEXTNODE = 'textnode';
    Type.TYPE_WHITESPACE = 'whitespace';
    Type.TYPE_OBJECT = 'object';
    /**
     * @method isString
     * @param {*} value
     * @returns {boolean}
     */
    Type.isString = function (value) {
        return typeof (value) == Type.TYPE_STRING;
    };
    /**
     * @method isNaN
     * @param value
     * @returns {boolean}
     */
    Type.isNaN = function (value) {
        return isNaN(value) && value != value;
    };
    /**
     * @method isNotANumber
     * @param value
     * @returns {boolean}
     */
    Type.isNotANumber = function (value) {
        return isNaN(value);
    };
    /**
     * @method isElement
     * @param value
     * @returns {boolean}
     */
    Type.isElement = function (value) {
        if (value.nodeType == 1) {
            return true;
        }
        return false;
    };
    /**
     * @method isTextNode
     * @param value
     * @returns {boolean}
     */
    Type.isTextNode = function (value) {
        if (value.nodeType == 3 && (/\S/).test(value.nodeValue)) {
            return true;
        }
        return false;
    };
    /**
     * @method isWhiteSpace
     * @param value
     * @returns {boolean}
     */
    Type.isWhiteSpace = function (value) {
        if (value.nodeType == 3 && !(/\S/).test(value.nodeValue)) {
            return true;
        }
        return false;
    };
    /**
     * @method isUndefined
     * @param value
     * @returns {boolean}
     */
    Type.isUndefined = function (value) {
        return value === void 0;
    };
    /**
     * @method isDefined
     * @param value
     * @returns {boolean}
     */
    Type.isDefined = function (value) {
        return value !== void 0;
    };
    /**
     * @method isArray
     * @param value
     * @returns {boolean}
     */
    Type.isArray = function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };
    /**
     * @method isFunction
     * @param value
     * @returns {boolean}
     */
    Type.isFunction = function (value) {
        return value && {}.toString.call(value) === '[object Function]';
    };
    /**
     *
     * @method isBoolean
     * @param value
     * @returns {boolean}
     */
    Type.isBoolean = function (value) {
        return typeof value == Type.TYPE_BOOLEAN;
    };
    /**
     *
     * @method isInteger
     * @param value
     * @returns {boolean}
     */
    Type.isInteger = function (value) {
        return !Type.isFloat(value);
    };
    /**
     * Can check floating points 1.0 but have to do it with string
     * @method isFloat
     * @param value
     * @returns {boolean}
     */
    Type.isFloat = function (value) {
        if (Number(value) !== value) {
            return false;
        }
        if (String(value).indexOf('.') > -1) {
            return true;
        }
        return false;
    };
    /**
     *
     * @method isObject
     * @param value
     * @returns {boolean}
     */
    Type.isObject = function (value) {
        return typeof value == Type.TYPE_OBJECT;
    };
    /**
     * @method isDate
     * @param value
     * @returns {boolean}
     */
    Type.isDate = function (value) {
        return !Type.isUndefined(value) && typeof value.getMonth === 'function';
    };
    /**
     * @method isArguments
     * @param value
     * @returns {boolean}
     */
    Type.isArguments = function (value) {
        return 'callee' in value;
    };
    /**
     * @method isNULL
     * @param value
     * @returns {boolean}
     */
    Type.isNULL = function (value) {
        return value === null;
    };
    return Type;
});
