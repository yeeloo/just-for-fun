define(["require", "exports"], function (require, exports) {
    /**
     * The Gateway class
     *
     * @class Gateway
     */
    var Gateway = (function () {
        /**
         * The Gateway class
         *
         * @class Gateway
         */
        /**
         * @class Gateway
         * @constructor
         * @param {string} url
         * @param {boolean} debug
         */
        function Gateway(url, debug) {
            if (debug === void 0) { debug = false; }
            this.url = url;
            this.debug = debug;
        }
        /**
         * @method get
         * @param {string} action
         * @param {any} data
         * @param {Function} callback
         * @param {any} codeType
         */
        Gateway.prototype.get = function (action, data, callback, codeType) {
            if (data === void 0) { data = null; }
            if (callback === void 0) { callback = null; }
            this.execute(Method.GET, action, data, callback, codeType);
        };
        /**
         * @method post
         * @param {string} action
         * @param {any} data
         * @param {Function} callback
         * @param {any} codeType
         */
        Gateway.prototype.post = function (action, data, callback, codeType) {
            if (data === void 0) { data = null; }
            if (callback === void 0) { callback = null; }
            this.execute(Method.POST, action, data, callback, codeType);
        };
        /**
         * @method execute
         * @param {string} method
         * @param {string} action
         * @param {any} data
         * @param {Function} callback
         * @param {any} codeType
         */
        Gateway.prototype.execute = function (method, action, data, callback, codeType) {
            if (data === void 0) { data = null; }
            if (callback === void 0) { callback = null; }
            if (this.debug)
                console.log('execute', method, action, data);
            if (data == null)
                data = {};
            for (var key in data) {
                if (data.hasOwnProperty(key) && (typeof data[key] === 'object' || typeof data[key] === 'array')) {
                    data[key] = JSON.stringify(data[key]);
                }
            }
            var request = new Request({
                url: this.url + action,
                method: method.toLowerCase(),
                data: data,
                onSuccess: function (responseText) {
                    if (callback) {
                        try {
                            var response = JSON.parse(responseText);
                            if (codeType && response.code && codeType.hasOwnProperty("get")) {
                                var code = codeType.get(response.code);
                                if (code) {
                                    response.code = code;
                                }
                                else {
                                    console.warn("Unable to convert '" + response.code + "' to " + codeType);
                                }
                            }
                        }
                        catch (error) {
                            console.error('GATEWAY ERROR: ', responseText);
                            var response = {
                                success: false,
                                data: responseText
                            };
                        }
                        callback(response);
                    }
                },
                onFailure: function () {
                    if (callback) {
                        callback({
                            'success': false,
                            'data': 'unkown error'
                        });
                    }
                }
            });
            request.send();
        };
        return Gateway;
    })();
    exports.Gateway = Gateway;
    var Method = (function () {
        function Method() {
        }
        Method.GET = "get";
        Method.POST = "post";
        return Method;
    })();
    exports.Method = Method;
});
