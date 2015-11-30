define(["require", "exports"], function (require, exports) {
    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        /**
         * Checks if an array contains a specific value
         */
        ArrayUtils.inArray = function (array, value) {
            return (array.indexOf(value) != -1);
        };
        /**
         * Checks if an element in the array has a field with a specific value
         */
        ArrayUtils.inArrayField = function (array, field, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][field] == value)
                    return true;
            }
            return false;
        };
        /**
         * Get a random element form the array
         */
        ArrayUtils.randomElement = function (array) {
            if (array.length > 0) {
                return array[Math.floor(Math.random() * array.length)];
            }
            return null;
        };
        /**
         * Shuffles an array (sort random)
         */
        ArrayUtils.shuffle = function (array) {
            var i = array.length;
            if (i == 0) {
                return;
            }
            var j;
            var temp;
            while (--i) {
                j = Math.floor(Math.random() * (i + 1));
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        };
        /**
         * copies the source array to the target array, without remove the reference
         */
        ArrayUtils.copy = function (array, target) {
            var leni = target.length = array.length;
            for (var i = 0; i < leni; i++) {
                target[i] = array[i];
            }
        };
        /**
         * recursively clone an Array and it's sub-Array's (doesn't clone content objects)
         */
        ArrayUtils.deepArrayClone = function (array) {
            var ret = array.concat();
            var iLim = ret.length;
            var i;
            for (i = 0; i < iLim; i++) {
                if (ret[i] instanceof Array) {
                    ret[i] = ArrayUtils.deepArrayClone(ret[i]);
                }
            }
            return ret;
        };
        /**
         * Calculates the average value of all elements in an array
         * Works only for array's with numeric values
         */
        ArrayUtils.average = function (array) {
            if (array == null || array.length == 0)
                return NaN;
            var total = 0;
            for (var i = 0; i < array.length; i++) {
                total += array[i];
            }
            return total / array.length;
        };
        /**
         * Remove all instances of the specified value from the array,
         * @param array The array from which the value will be removed
         * @param value The item that will be removed from the array.
         *
         * @return the number of removed items
         */
        ArrayUtils.removeValueFromArray = function (array, value) {
            var total = 0;
            for (var i = array.length - 1; i > -1; i--) {
                if (array[i] === value) {
                    array.splice(i, 1);
                    total++;
                }
            }
            return total;
        };
        /**
         * Removes a single (first occurring) value from an Array.
         * @param array The array from which the value will be removed
         * @param value The item that will be removed from the array.
         *
         * @return a boolean which indicates if a value is removed
         */
        ArrayUtils.removeValueFromArrayOnce = function (array, value) {
            var len = array.length;
            for (var i = len; i > -1; i--) {
                if (array[i] === value) {
                    array.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        /**
         * Create a new array that only contains unique instances of objects
         * in the specified array.
         *
         * <p>Basically, this can be used to remove duplication object instances
         * from an array</p>
         *
         * @param array The array which contains the values that will be used to
         * create the new array that contains no duplicate values.
         *
         * @return A new array which only contains unique items from the specified
         * array.
         */
        ArrayUtils.createUniqueCopy = function (array) {
            var newArray = [];
            var len = array.length;
            var item;
            for (var i = 0; i < len; ++i) {
                item = array[i];
                if (ArrayUtils.inArray(newArray, item)) {
                    continue;
                }
                newArray.push(item);
            }
            return newArray;
        };
        /**
         * Creates a copy of the specified array.
         *
         * <p>Note that the array returned is a new array but the items within the
         * array are not copies of the items in the original array (but rather
         * references to the same items)</p>
         *
         * @param array The array that will be cloned.
         *
         * @return A new array which contains the same items as the array passed
         * in.
         */
        ArrayUtils.clone = function (array) {
            return array.slice(0, array.length);
        };
        /**
         * Compares two arrays and returns a boolean indicating whether the arrays
         * contain the same values at the same indexes.
         *
         * @param array1 The first array that will be compared to the second.
         * @param array2 The second array that will be compared to the first.
         *
         * @return True if the arrays contains the same values at the same indexes.
         *     False if they do not.
         */
        ArrayUtils.areEqual = function (array1, array2) {
            if (array1 == array2) {
                return true;
            }
            if (array1.length != array2.length) {
                return false;
            }
            for (var i = array1.length - 1; i >= 0; --i) {
                if (array1[i] != array2[i]) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Returns the amount of (not empty) items in an Array.
         */
        ArrayUtils.filledLength = function (array) {
            var length = 0;
            var leni = array.length;
            for (var i = 0; i < leni; i++) {
                if (array[i] != undefined)
                    length++;
            }
            return length;
        };
        /**
         * Returs the items that are unique in the first array
         */
        ArrayUtils.getUniqueFirst = function (array1, array2) {
            var ret = [];
            for (var i = 0; i < array1.length; i++) {
                if (array2.indexOf(array1[i]) == -1)
                    ret.push(array1[i]);
            }
            return ret;
        };
        /**
         * Returs the items that are in both arrays
         */
        ArrayUtils.intersect = function (array1, array2) {
            var ret = [];
            var i;
            for (i = 0; i < array1.length; i++) {
                if (array2.indexOf(array1[i]) != -1)
                    ret.push(array1[i]);
            }
            for (i = 0; i < array2.length; i++) {
                if (array1.indexOf(array2[i]) != -1)
                    ret.push(array2[i]);
            }
            ret = ArrayUtils.createUniqueCopy(ret);
            return ret;
        };
        /**
         * Adds an element to an Array
         * @param element the element to add
         * @param amount number of times the element must be added
         * @param array the array where the element is added to. If null, a new Array is created
         *
         * @return the array or the newly create array, with the element
         */
        ArrayUtils.addElements = function (element, amount, array) {
            if (array === void 0) { array = null; }
            if (!array)
                array = [];
            for (var i = 0; i < amount; i++) {
                array.push(element);
            }
            return array;
        };
        /**
         * Simple joins a Array to a String
         */
        ArrayUtils.simpleJoin = function (array, sort, pre, post, empty) {
            if (sort === void 0) { sort = true; }
            if (pre === void 0) { pre = ' - '; }
            if (post === void 0) { post = '\n'; }
            if (empty === void 0) { empty = '(empty)'; }
            if (!array) {
                return '(null array)';
            }
            if (array.length == 0) {
                return empty;
            }
            if (sort) {
                array = array.concat().sort();
            }
            return pre + array.join(post + pre) + post;
        };
        /**
         * Returns a new Array from an Array without the empty (null, '' or undefined) elements.
         */
        ArrayUtils.removeEmptyElements = function (array) {
            var results = [];
            for (var i = 0; i < array.length; ++i) {
                if (array[i] != '' && array[i] != null && array[i] != undefined)
                    results.push(array[i]);
            }
            return results;
        };
        /*
         ---
    
         script: Array.sortOn.js
    
         description: Adds Array.sortOn function and related constants that works like in ActionScript for sorting arrays of objects (applying all same strict rules)
    
         license: MIT-style license.
    
         authors:
         - gonchuki
    
         github: https://github.com/gonchuki/mootools-Array.sortOn/blob/master/Source/Array.sortOn.js
         docs: http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/Array.html#sortOn()
    
         requires:
         - core/1.2.4: [Array]
    
         provides:
         - [sortOn, CASEINSENSITIVE, DESCENDING, UNIQUESORT, RETURNINDEXEDARRAY, NUMERIC]
    
         ...
         */
        ArrayUtils.sortOn = function (array, fields, options) {
            var dup_fn = function (field, field_options) {
                var filtered = (field_options & ArrayUtils.NUMERIC) ? this.map(function (item) {
                    return item[field].toFloat();
                }) : (field_options & ArrayUtils.CASEINSENSITIVE) ? this.map(function (item) {
                    return item[field].toLowerCase();
                }) : this.map(function (item) {
                    return item[field];
                });
                return filtered.length !== []['combine'](filtered).length;
            };
            var sort_fn = function (item_a, item_b, fields, options) {
                return (function sort_by(fields, options) {
                    var ret, a, b, opts = options[0], sub_fields = fields[0].match(/[^.]+/g);
                    (function get_values(s_fields, s_a, s_b) {
                        var field = s_fields[0];
                        if (s_fields.length > 1) {
                            get_values(s_fields.slice(1), s_a[field], s_b[field]);
                        }
                        else {
                            a = s_a[field].toString();
                            b = s_b[field].toString();
                        }
                    })(sub_fields, item_a, item_b);
                    if (opts & ArrayUtils.NUMERIC) {
                        ret = (a.toFloat() - b.toFloat());
                    }
                    else {
                        if (opts & ArrayUtils.CASEINSENSITIVE) {
                            a = a.toLowerCase();
                            b = b.toLowerCase();
                        }
                        ret = (a > b) ? 1 : (a < b) ? -1 : 0;
                    }
                    if ((ret === 0) && (fields.length > 1)) {
                        ret = sort_by(fields.slice(1), options.slice(1));
                    }
                    else if (opts & ArrayUtils.DESCENDING) {
                        ret *= -1;
                    }
                    return ret;
                })(fields, options);
            };
            fields = Array['from'](fields);
            options = Array['from'](options);
            if (options.length !== fields.length)
                options = [];
            if ((options[0] & ArrayUtils.UNIQUESORT) && (fields.some(function (field, i) {
                return dup_fn(field, options[i]);
            })))
                return 0;
            var curry_sort = function (item_a, item_b) {
                return sort_fn(item_a, item_b, fields, options);
            };
            if (options[0] & ArrayUtils.RETURNINDEXEDARRAY) {
                return array.concat().sort(curry_sort);
            }
            else {
                return array.sort(curry_sort);
            }
        };
        ArrayUtils.CASEINSENSITIVE = 1;
        ArrayUtils.DESCENDING = 2;
        ArrayUtils.UNIQUESORT = 4;
        ArrayUtils.RETURNINDEXEDARRAY = 8;
        ArrayUtils.NUMERIC = 16;
        return ArrayUtils;
    })();
    return ArrayUtils;
});
