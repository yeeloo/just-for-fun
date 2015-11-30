define(["require", "exports", 'lib/temple/utils/types/StringUtils'], function (require, exports, StringUtils) {
    /**
     * This class contains some functions for URLs.
     *
     * @author Thijs Broerse
     */
    var URLUtils = (function () {
        function URLUtils() {
        }
        /**
         * Provides the value of a specific query parameter.
         * @param param Parameter name.
         */
        URLUtils.getParameter = function (url, param) {
            var index = url.indexOf('?');
            if (index != -1) {
                url = url.substr(index + 1);
                var params = url.split('&');
                var p;
                var i = params.length;
                while (i--) {
                    p = params[i].split('=');
                    if (p[0] == param) {
                        return p[1];
                    }
                }
            }
            return '';
        };
        /**
         * Checks if the URL contains a specific parameter
         */
        URLUtils.hasParameter = function (url, param) {
            return url.indexOf(param + '=') != -1;
        };
        /**
         * Add a parameter to the url
         */
        URLUtils.addParameter = function (url, param, value) {
            return url + (url.indexOf('?') == -1 ? '?' : '&') + param + '=' + value;
        };
        /**
         * Set a parameter in the URL
         */
        URLUtils.setParameter = function (url, param, value) {
            if (URLUtils.hasParameter(url, param)) {
                return url.replace(new RegExp('(' + param + '=)([^&]+)', 'g'), '$1' + value);
            }
            else {
                return URLUtils.addParameter(url, param, value);
            }
        };
        /**
         * Get the file extension of an URL
         */
        URLUtils.getFileExtension = function (url) {
            if (url == null) {
                return null;
            }
            if (url.indexOf('?') != -1) {
                url = StringUtils.beforeFirst(url, '?');
            }
            return StringUtils.afterLast(url, '.');
        };
        /**
         * Checks if a url is absolute (<code>true</code>) or relative (<code>false</code>)
         */
        URLUtils.isAbsolute = function (url) {
            return /^[\w-\.]*:/.test(url);
        };
        return URLUtils;
    })();
    return URLUtils;
});
