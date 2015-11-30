define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some functions for Regular Expressions.
     *
     * @author Arjan van Wijk
     */
    var RegExpUtils = (function () {
        function RegExpUtils() {
        }
        /**
         * @method pregMatchAll
         *
         * Searches text for all matches to the regular expression given in pattern and return the result.
         * Modelled like http://php.net/manual/en/function.preg-match-all.php
         *
         * @param regExp the regular expression
         * @param content the string to search on
         */
        RegExpUtils.pregMatchAll = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            var index = -1;
            while (result != null && index != result.index) {
                for (var i = 0; i < result.length; ++i) {
                    if (true) {
                        if (resultList[i] == null)
                            resultList[i] = [];
                        resultList[i].push(result[i] != undefined ? result[i] : '');
                    }
                    else {
                    }
                }
                index = result.index;
                result = regExp.exec(content);
            }
            return resultList;
        };
        /**
         * @method pregMatch
         *
         * Searches for a match to the regular expression given in pattern.
         * Moddelled like http://php.net/manual/en/function.preg-match.php
         *
         * @param regExp {RegExp} the regular expression
         * @param content {string} the string to search on
         */
        RegExpUtils.pregMatch = function (regExp, content) {
            var resultList = [];
            var result = regExp.exec(content);
            if (result != null) {
                for (var i = 0; i < result.length; ++i) {
                    resultList.push(result[i] != undefined ? result[i] : '');
                }
            }
            return resultList;
        };
        return RegExpUtils;
    })();
    return RegExpUtils;
});
