define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some functions for Strings.
     *
     * @module Temple
     * @namespace temple.utils.types
     * @class StringUtils
     * @author Arjan van Wijk, Thijs Broerse
     */
    var StringUtils = (function () {
        function StringUtils() {
        }
        /**
         * Repeats a string
         * @param string the string to repeat
         * @param amount how many times the string should be repeated
         */
        StringUtils.repeat = function (string, amount) {
            var ret = '';
            for (var i = 0; i < amount; i++) {
                ret += string;
            }
            return ret;
        };
        /**
         * Add a character to the left of a string till it has a specified length
         * @param string the original string
         * @param length the length of the result string
         * @param fillChar the character that need the be attached to the left of string
         */
        StringUtils.padLeft = function (string, length, fillChar) {
            if (fillChar === void 0) { fillChar = ' '; }
            if (fillChar == null || fillChar.length == 0) {
                throw 'invalid value for fillChar: "' + fillChar + '"';
            }
            if (string.length < length) {
                var lim = length - string.length;
                for (var i = 0; i < lim; i++) {
                    string = fillChar + string;
                }
            }
            return string;
        };
        /**
         * Add a character to the right of a string till it has a specified length
         * @param string the original string
         * @param length the length of the result string
         * @param fillChar the character that need the be attached to the right of string
         */
        StringUtils.padRight = function (string, length, fillChar) {
            if (fillChar === void 0) { fillChar = ' '; }
            if (fillChar == null || fillChar.length == 0) {
                throw 'invalid value for fillChar: "' + fillChar + '"';
            }
            if (string.length < length) {
                var lim = length - string.length;
                for (var i = 0; i < lim; i++) {
                    string += fillChar;
                }
            }
            return string;
        };
        /**
         * replaces all tabs, newlines spaces to just one space
         * Works the same as ignore whitespace for XML
         */
        StringUtils.ignoreWhiteSpace = function (string) {
            return string.replace(/[\t\r\n]|\s\s/g, '');
        };
        /**
         * Does a case insensitive compare or two strings and returns true if they are equal.
         * @param string1 The first string to compare.
         * @param s2 The second string to compare.
         * @param An optional boolean indicating if the equal is case sensitive. Default is true.
         * @return A boolean value indicating whether the strings' values are equal in a case sensitive compare.
         */
        StringUtils.stringsAreEqual = function (string1, string2, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (caseSensitive) {
                return (string1 == string2);
            }
            else {
                return (string1.toUpperCase() == string2.toUpperCase());
            }
        };
        /**
         * Camelcases a string, e.g. my-awesome-string will turn into MyAwesomeString
         * @param str
         * @returns {string}
         */
        StringUtils.camelCase = function (str, camelCaseFirst) {
            if (camelCaseFirst === void 0) { camelCaseFirst = true; }
            return str.replace(/(^[a-z]|\-[a-z])/g, function (match, submatch, offset) {
                if (camelCaseFirst == false && offset == 0) {
                    return match.replace(/-/, '').toLowerCase();
                }
                else {
                    return match.replace(/-/, '').toUpperCase();
                }
            });
        };
        /**
         * Removes whitespace from the front and the end of the specified string.
         * @param string The String whose beginning and ending whitespace will be removed.
         * @return A String with whitespace removed from the beginning and end
         */
        StringUtils.trim = function (string) {
            return StringUtils.ltrim(StringUtils.rtrim(string));
        };
        /**
         * Removes whitespace from the front of the specified string.
         * @param string The String whose beginning whitespace will will be removed.
         * @return A String with whitespace removed from the begining
         */
        StringUtils.ltrim = function (string) {
            var size = string.length;
            for (var i = 0; i < size; i++) {
                if (string.charCodeAt(i) > 32) {
                    return string.substring(i);
                }
            }
            return '';
        };
        /**
         * Removes whitespace from the end of the specified string.
         * @param string The String whose ending whitespace will be removed.
         * @return A String with whitespace removed from the end
         */
        StringUtils.rtrim = function (string) {
            var size = string.length;
            for (var i = size; i > 0; i--) {
                if (string.charCodeAt(i - 1) > 32) {
                    return string.substring(0, i);
                }
            }
            return '';
        };
        /**
         * Determines whether the specified string begins with the spcified prefix.
         * @param string The string that the prefix will be checked against.
         * @param prefix The prefix that will be tested against the string.
         * @return true if the string starts with the prefix, false if it does not.
         */
        StringUtils.beginsWith = function (string, prefix) {
            return (prefix == string.substring(0, prefix.length));
        };
        /**
         * Determines whether the specified string ends with the spcified suffix.
         * @param string The string that the suffic will be checked against.
         * @param prefix The suffic that will be tested against the string.
         * @return true if the string ends with the suffix, false if it does not.
         */
        StringUtils.endsWith = function (string, suffix) {
            return (suffix == string.substring(string.length - suffix.length));
        };
        /**
         * Removes all instances of the remove string in the input string.
         * @param string The string that will be checked for instances of remove
         * @param remove The string that will be removed from the input string.
         * @param caseSensitive An optional boolean indicating if the replace is case sensitive. Default is true.
         */
        StringUtils.remove = function (string, remove, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (string == null) {
                return '';
            }
            var rem = StringUtils.escapePattern(remove);
            var flags = (!caseSensitive) ? 'ig' : 'g';
            return string.replace(new RegExp(rem, flags), '');
        };
        StringUtils.escapePattern = function (pattern) {
            return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
        };
        /**
         * Escapes a UTF-8 string to unicode; e.g. "é" -> "\u00e9"
         * @param input The string to be escaped
         * @return An escaped UTF-8 String
         */
        StringUtils.escapeToUnicode = function (input) {
            var inputCopy = input;
            var escapedInput = '';
            for (var i = 0; i < inputCopy.length; i++) {
                escapedInput += StringUtils.escapeToUnicodeChar(inputCopy.substr(i, 1));
            }
            return escapedInput;
        };
        /**
         * Escapes a UTF-8 character to unicode; e.g. "é" -> "\u00e9"
         * @param inputChar The character to be escaped
         * @return An escaped UTF-8 String
         */
        StringUtils.escapeToUnicodeChar = function (inputChar) {
            if (inputChar < ' ' || inputChar > '}') {
                // get the hex digit(s) of the character (either 1 or 2 digits)
                var hexCode = inputChar.charCodeAt(0).toString(16);
                while (hexCode.length < 4) {
                    hexCode = '0' + hexCode;
                }
                // create the unicode escape sequence with 4 hex digits
                return '\\u' + hexCode;
            }
            else {
                return inputChar;
            }
        };
        /**
         * Replaces all instances of the replace string in the input string with the replaceWith string.
         * @param string The string that instances of replace string will be replaces with removeWith string.
         * @param replace The string that will be replaced by instances of the replaceWith string.
         * @param replaceWith The string that will replace instances of replace string.
         * @return A new String with the replace string replaced with the replaceWith string.
         */
        StringUtils.replace = function (string, replace, replaceWith) {
            var sb = '';
            var found = false;
            var sLen = string.length;
            var rLen = replace.length;
            for (var i = 0; i < sLen; i++) {
                if (string.charAt(i) == replace.charAt(0)) {
                    found = true;
                    for (var j = 0; j < rLen; j++) {
                        if (!(string.charAt(i + j) == replace.charAt(j))) {
                            found = false;
                            break;
                        }
                    }
                    if (found) {
                        sb += replaceWith;
                        i = i + (rLen - 1);
                        continue;
                    }
                }
                sb += string.charAt(i);
            }
            return sb;
        };
        /**
         * Replaces vars in a String. Vars defined between {}: '{var}'. The var can be prefix with an (optional) $.
         * Searches for a value in de object with the same name as the var.
         *
         * @param string the String containing variable which must be replaced
         * @param object an object containing all the properties for the replacement (as name-value pair)
         * @param keepIrreplaceableVars a boolean which indicates if variables which can not be replaced should be
         * removed (false) or should be kept (true) in the string
         * @param debug if set true the replacement will not be executed in a try-catch statement.
         */
        StringUtils.replaceVars = function (string, object, keepIrreplaceableVars, debug) {
            if (keepIrreplaceableVars === void 0) { keepIrreplaceableVars = true; }
            if (debug === void 0) { debug = false; }
            if (string == null) {
                throw 'String can not be null';
            }
            if (object == null) {
                throw 'Object can not be null';
            }
            return string.replace(/\$?\{([@#$%&\w]*)(\((.*?)\))?\}/gi, function () {
                var prop = arguments[1];
                if (object != null && prop in object) {
                    if (typeof object[prop] == 'function' && arguments[2]) {
                        if (arguments[3]) {
                            var args = arguments[3].split(',');
                            for (var i = 0, leni = args.length; i < leni; i++) {
                                args[i] = StringUtils.replaceVars(args[i], object);
                            }
                        }
                        var argsss = arguments;
                        if (debug) {
                            return (object[prop]).apply(null, args);
                        }
                        else {
                            try {
                                return (object[prop]).apply(null, args);
                            }
                            catch (error) {
                                console.log('Unable to replace var ' + argsss[0] + ': ' + error.message);
                            }
                        }
                    }
                    else {
                        return object[prop];
                    }
                }
                if (keepIrreplaceableVars) {
                    return '{' + prop + '}';
                }
                if (debug) {
                    return '*VALUE \'' + prop + '\' NOT FOUND*';
                }
                return '';
            });
        };
        /**
         * Returns everything after the first occurrence of the provided character in the string.
         */
        StringUtils.afterFirst = function (string, character) {
            if (string == null) {
                return '';
            }
            var idx = string.indexOf(character);
            if (idx == -1) {
                return '';
            }
            idx += character.length;
            return string.substr(idx);
        };
        /**
         * Returns everything after the last occurence of the provided character in source.
         */
        StringUtils.afterLast = function (string, character) {
            if (string == null) {
                return '';
            }
            var idx = string.lastIndexOf(character);
            if (idx == -1) {
                return '';
            }
            idx += character.length;
            return string.substr(idx);
        };
        /**
         * Returns everything before the first occurrence of the provided character in the string.
         */
        StringUtils.beforeFirst = function (string, character) {
            if (string == null) {
                return '';
            }
            var characterIndex = string.indexOf(character);
            if (characterIndex == -1) {
                return '';
            }
            return string.substr(0, characterIndex);
        };
        /**
         * Returns everything before the last occurrence of the provided character in the string.
         */
        StringUtils.beforeLast = function (string, character) {
            if (string == null) {
                return '';
            }
            var characterIndex = string.lastIndexOf(character);
            if (characterIndex == -1) {
                return '';
            }
            return string.substr(0, characterIndex);
        };
        /**
         * Returns everything after the first occurance of start and before the first occurrence of end in the given string.
         */
        StringUtils.between = function (string, start, end) {
            var str = '';
            if (string == null) {
                return str;
            }
            var startIdx = string.indexOf(start);
            if (startIdx != -1) {
                startIdx += start.length;
                var endIdx = string.indexOf(end, startIdx);
                if (endIdx != -1) {
                    str = string.substr(startIdx, endIdx - startIdx);
                }
            }
            return str;
        };
        /**
         * Determines whether the specified string contains any instances of char.
         */
        StringUtils.contains = function (source, char) {
            return source ? source.indexOf(char) != -1 : false;
        };
        /**
         * Returns a string truncated to a specified length with optional suffix
         * @param string The string.
         * @param len The length the string should be shortend to
         * @param suffix (optional, default=...) The string to append to the end of the truncated string.
         */
        StringUtils.truncate = function (string, len, suffix) {
            if (suffix === void 0) { suffix = '...'; }
            if (string == null) {
                return '';
            }
            len -= suffix.length;
            var trunc = string;
            if (trunc.length > len) {
                trunc = trunc.substr(0, len);
                if (/[^\s]/.test(string.charAt(len))) {
                    trunc = StringUtils.rtrim(trunc.replace(/\w+$|\s+$/, ''));
                }
                trunc += suffix;
            }
            return trunc;
        };
        /**
         * Returns a string with the first character of source capitalized, if that character is alphabetic.
         */
        StringUtils.ucFirst = function (string) {
            return string ? string.substr(0, 1).toUpperCase() + string.substr(1) : null;
        };
        /**
         * Determines the number of times a charactor or sub-string appears within the string.
         * @param string The string.
         * @param char The character or sub-string to count.
         * @param caseSensitive (optional, default is true) A boolean flag to indicate if the search is case sensitive.
         */
        StringUtils.countOf = function (string, char, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (string == null) {
                return 0;
            }
            char = StringUtils.escapePattern(char);
            var flags = (!caseSensitive) ? 'ig' : 'g';
            return string.match(new RegExp(char, flags)).length;
        };
        /**
         * Counts the total amount of words in a text
         * NOTE: does only work correctly for English texts
         */
        StringUtils.countWords = function (string) {
            if (string == null) {
                return 0;
            }
            return string.match(/\b\w+\b/g).length;
        };
        /**
         * Levenshtein distance (editDistance) is a measure of the similarity between two strings. The distance is the number of deletions, insertions, or substitutions required to transform source into target.
         */
        StringUtils.editDistance = function (string, target) {
            var i;
            if (string == null) {
                string = '';
            }
            if (target == null) {
                target = '';
            }
            if (string == target) {
                return 0;
            }
            var d = [];
            var cost;
            var n = string.length;
            var m = target.length;
            var j;
            if (n == 0) {
                return m;
            }
            if (m == 0) {
                return n;
            }
            for (i = 0; i <= n; i++) {
                d[i] = [];
            }
            for (i = 0; i <= n; i++) {
                d[i][0] = i;
            }
            for (j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (i = 1; i <= n; i++) {
                var s_i = string.charAt(i - 1);
                for (j = 1; j <= m; j++) {
                    var t_j = target.charAt(j - 1);
                    if (s_i == t_j) {
                        cost = 0;
                    }
                    else {
                        cost = 1;
                    }
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            }
            return d[n][m];
        };
        /**
         * Determines whether the specified string contains text.
         */
        StringUtils.hasText = function (string) {
            return string && StringUtils.removeExtraWhitespace(string).length > 0;
        };
        /**
         * Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the specified string.
         */
        StringUtils.removeExtraWhitespace = function (string) {
            if (string == null) {
                return '';
            }
            var str = StringUtils.trim(string);
            return str.replace(/\s+/g, ' ');
        };
        /**
         * Determines whether the specified string contains any characters.
         */
        StringUtils.isEmpty = function (string) {
            return !string;
        };
        /**
         * Determines whether the specified string is numeric.
         */
        StringUtils.isNumeric = function (string) {
            if (string == null) {
                return false;
            }
            var regx = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
            return regx.test(string);
        };
        /**
         * Escapes all of the characters in a string to create a friendly "quotable" sting
         */
        StringUtils.quote = function (string) {
            var regx = /[\\"\r\n]/g;
            return '"' + string.replace(regx, StringUtils._quote) + '"'; //"
        };
        StringUtils._quote = function (source) {
            switch (source) {
                case '\\':
                    return '\\\\';
                case '\r':
                    return '\\r';
                case '\n':
                    return '\\n';
                case '"':
                    return '\\"';
                default:
                    return '';
            }
        };
        /**
         * Returns the specified string in reverse character order.
         */
        StringUtils.reverse = function (string) {
            if (string == null) {
                return '';
            }
            return string.split('').reverse().join('');
        };
        /**
         * Returns the specified string in reverse word order.
         */
        StringUtils.reverseWords = function (string) {
            if (string == null) {
                return '';
            }
            return string.split(/\s+/).reverse().join(' ');
        };
        /**
         * Determines the percentage of similarity, based on editDistance
         */
        StringUtils.similarity = function (string, target) {
            var ed = StringUtils.editDistance(string, target);
            var maxLen = Math.max(string.length, target.length);
            if (maxLen == 0) {
                return 100;
            }
            else {
                return (1 - ed / maxLen) * 100;
            }
        };
        /**
         * Removes all &lt; and &gt; based tags from a string
         */
        StringUtils.stripTags = function (string) {
            if (string == null) {
                return '';
            }
            return string.replace(/<\/?[^>]+>/igm, '');
        };
        /**
         * Swaps the casing of a string.
         */
        StringUtils.swapCase = function (string) {
            if (string == null) {
                return '';
            }
            return string.replace(/(\w)/, StringUtils._swapCase);
        };
        StringUtils._swapCase = function (char) {
            var lowChar = char.toLowerCase();
            var upChar = char.toUpperCase();
            switch (char) {
                case lowChar:
                    return upChar;
                case upChar:
                    return lowChar;
                default:
                    return char;
            }
        };
        /**
         * Removes all instances of word in string.
         * @param string the original string.
         * @param word the word to remove from string.
         * @param caseSensitive indicates in removing is case sensative.
         * @return the string without the word
         */
        StringUtils.removeWord = function (string, word, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            return string.replace(new RegExp('^' + word + '(\\W)|(\\W)' + word + '$|\\W' + word + '(?=\\W)', 'g' + (caseSensitive ? '' : 'i')), '');
        };
        /**
         * Removes all instances of all words in string
         * @param string the original string
         * @param word the word to remove from string
         * @param caseSensitive indicates in removing is case sensative.
         * @return the string without the word
         */
        StringUtils.removeWords = function (string, words, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            var leni = words.length;
            for (var i = 0; i < leni; i++) {
                string = StringUtils.removeWord(string, words[i], caseSensitive);
            }
            return string;
        };
        /**
         * Split a string on multiple seperators
         * @param string The string.
         * @param seperators Array with the seperators to split on
         * @param reappendSeperator (optional) Re-append the seperator after each part
         * @return a single-dimension array with the parts
         */
        StringUtils.splitMultiSeperator = function (string, seperators, reappendSeperator) {
            if (reappendSeperator === void 0) { reappendSeperator = false; }
            var ret = [string];
            for (var i = 0; i < seperators.length; i++) {
                ret = StringUtils.splitElements(ret, seperators[i], reappendSeperator);
            }
            return ret;
        };
        /**
         * Split multiple strings on a seperator
         * @param string Array with the strings
         * @param seperators The seperator to split on
         * @param reappendSeperator (optional) Re-append the seperator after each part
         * @return a single-dimension array with the parts
         */
        StringUtils.splitElements = function (strings, seperator, reappendSeperator) {
            if (reappendSeperator === void 0) { reappendSeperator = false; }
            var ret = [];
            for (var i = 0; i < strings.length; i++) {
                var split = strings[i].split(seperator);
                for (var j = 0; j < split.length; j++) {
                    var p = StringUtils.trim(split[j]);
                    if (p != '') {
                        ret.push(reappendSeperator && j < split.length - 1 ? p + seperator : p);
                    }
                }
            }
            return ret;
        };
        /**
         * Trim all elements in an Array (in place)
         * @param string Array with the strings
         * @return the modified input array
         */
        StringUtils.trimAll = function (array) {
            for (var i = 0; i < array.length; i++) {
                array[i] = StringUtils.ltrim(StringUtils.rtrim(array[i]));
            }
            return array;
        };
        /**
         * Trim all elements in an Array, and after trimming remove any empty (== '') elements
         * @param string Array with the strings
         * @param seperators The seperator to split on
         * @param reappendSeperator (optional) Re-append the seperator after each part
         * @return a new array with the parts
         */
        StringUtils.trimAllFilter = function (array) {
            var ret = [];
            for (var i = 0; i < array.length; i++) {
                var tmp = StringUtils.ltrim(StringUtils.rtrim(array[i]));
                if (tmp != '') {
                    ret.push(tmp);
                }
            }
            return ret;
        };
        StringUtils.cleanSpecialChars = function (string) {
            var validString = '';
            var len = string.length;
            for (var i = 0; i < len; i++) {
                var charCode = string.charCodeAt(i);
                if ((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95) {
                    validString += '-';
                }
                else if ((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128)) {
                    validString += '-';
                }
                else if (charCode > 127) {
                    if ((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225) {
                        validString += 'a';
                    }
                    else if (charCode == 128 || charCode == 135) {
                        validString += 'c';
                    }
                    else if (charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233) {
                        validString += 'e';
                    }
                    else if ((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237) {
                        validString += 'i';
                    }
                    else if (charCode == 164 || charCode == 165) {
                        validString += 'n';
                    }
                    else if ((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337) {
                        validString += 'o';
                    }
                    else if (charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369) {
                        validString += 'u';
                    }
                }
                else {
                    validString += string.charAt(i);
                }
            }
            validString = validString.replace(/\-+/g, '-').replace(/\-*$/, '');
            return validString.toLowerCase();
        };
        StringUtils.makeMultiline = function (str, lineLength, splitOn, replaceSplit) {
            if (splitOn === void 0) { splitOn = ' '; }
            if (replaceSplit === void 0) { replaceSplit = "\n"; }
            var strArr = str.split(splitOn);
            var _l = 0;
            var resultStr = '';
            for (var i = 0; i < strArr.length; i++) {
                if ((_l + strArr[i].length + splitOn.length) > lineLength) {
                    if (resultStr.length == 0) {
                        resultStr = strArr[i];
                    }
                    else {
                        resultStr += replaceSplit + strArr[i];
                    }
                    _l = 0;
                }
                else {
                    if (resultStr.length == 0) {
                        resultStr = strArr[i];
                    }
                    else {
                        resultStr += splitOn + strArr[i];
                    }
                }
            }
            return StringUtils.ltrim(StringUtils.rtrim(resultStr));
        };
        StringUtils.uniqueID = function () {
            return (StringUtils._UID++).toString(36);
        };
        StringUtils._UID = Date.now();
        return StringUtils;
    })();
    return StringUtils;
});
