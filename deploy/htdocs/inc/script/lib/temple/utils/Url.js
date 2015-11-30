/**
 * Class for easy creating and manipulating Urls.
 *
 * Syntax:
 *
 * <code>protocol:(//)domain(|port)/path?query#hash</code>
 *
 * or
 *
 * <code>protocol:username:password(at)domain(|port)/path?query#hash</code>
 *
 * @see http://en.wikipedia.org/wiki/Uniform_resource_locator
 *
 * @author Thijs Broerse
 */
define(["require", "exports"], function (require, exports) {
    var Url = (function () {
        function Url(href) {
            if (href === void 0) { href = null; }
            if (href) {
                this.setHref(href);
            }
        }
        /**
         * The full string of the Url
         */
        Url.prototype.getHref = function () {
            if (this._protocol == Url.MAILTO) {
                return this.getScheme() + this.getEmail();
            }
            var href = this.getScheme() || "";
            var auth = this.getAuthentication();
            if (auth) {
                href += auth + "@";
            }
            if (this._domain) {
                href += this._domain;
            }
            if (this._port) {
                href += ":" + this._port;
            }
            if (this._path) {
                href += this._path;
            }
            var query = this.getQuery();
            if (query) {
                href += "?" + query;
            }
            if (this._hashList) {
                href += "#" + this.getHash();
            }
            return href;
        };
        /**
         * @private
         */
        Url.prototype.setHref = function (value) {
            this._protocol = null;
            this._domain = null;
            this._port = 0;
            this._path = null;
            this._variables = null;
            this._hashList = null;
            this._username = null;
            this._password = null;
            if (value) {
                var temp = value.split('#');
                this.setHash(temp[1]);
                temp = temp[0].toString().split('?');
                this.setQuery(temp[1]);
                var href = temp[0];
                if (href.indexOf(":") != -1) {
                    this._protocol = href.split(":")[0];
                }
                if (this._protocol) {
                    href = href.substr(this._protocol.length + 1);
                    if (href.substr(0, 2) == "//") {
                        href = href.substr(2);
                    }
                }
                if (this._protocol == Url.MAILTO) {
                    this.setEmail(href);
                }
                else if (this._protocol) {
                    var slash = href.indexOf("/");
                    if (slash != -1) {
                        this._domain = href.substr(0, slash);
                        this._path = href.substr(slash);
                    }
                    else {
                        this._domain = href;
                        this._path = null;
                    }
                    if (this._domain.indexOf("@") != -1) {
                        temp = this._domain.split("@");
                        this.setAuthentication(temp[0]);
                        this._domain = temp[1];
                    }
                    if (this._domain.indexOf(":") != -1) {
                        temp = this._domain.split(":");
                        this._domain = temp[0];
                        this._port = temp[1];
                    }
                }
                else {
                    this._domain = null;
                    this._path = href || null;
                    this._port = 0;
                }
            }
        };
        /**
         * The protocol of the Url
         *
         * @example
         * <listing version="3.0">
         * http
         * ftp
         * https
         * mailto
         * </listing>
         */
        Url.prototype.getProtocol = function () {
            return this._protocol;
        };
        /**
         * @private
         */
        Url.prototype.setProtocol = function (value) {
            this._protocol = value;
            return this;
        };
        /**
         * Domain of the Url
         */
        Url.prototype.getDomain = function () {
            return this._domain;
        };
        /**
         * Set the domain of the Url
         */
        Url.prototype.setDomain = function (value) {
            this._domain = value;
            return this;
        };
        /**
         * The port of the Url.
         *
         * 0 means no port.
         */
        Url.prototype.getPort = function () {
            return this._port;
        };
        /**
         * @private
         */
        Url.prototype.setPort = function (value) {
            this._port = value;
            return this;
        };
        /**
         * The path of the Url
         */
        Url.prototype.getPath = function () {
            return this._path;
        };
        /**
         * @private
         */
        Url.prototype.setPath = function (value) {
            this._path = value;
        };
        /**
         * The variables of the Url.
         */
        Url.prototype.getVariables = function () {
            return this._variables;
        };
        /**
         * @private
         */
        Url.prototype.setVariables = function (value) {
            this._variables = value;
        };
        /**
         * Checks if the Url has a variable
         */
        Url.prototype.hasVariable = function (name) {
            return this._variables && this._variables.hasOwnProperty(name);
        };
        /**
         * Get a variable of the Url.
         */
        Url.prototype.getVariable = function (name) {
            return this._variables ? this._variables[name] : null;
        };
        /**
         * Set a variable on the Url.
         */
        Url.prototype.setVariable = function (name, value) {
            if (!this._variables) {
                this._variables = {};
            }
            this._variables[name] = value;
            return this;
        };
        /**
         * Removes a variable from the Url
         */
        Url.prototype.deleteVariable = function (name) {
            delete this._variables[name];
        };
        /**
         * Name/value paired string, which comes after the question sign ('?').
         *
         * @example
         * <listing version="3.0">
         * http://www.domain.com/index.html?lorem=ipsum&amp;dolor=sit&amp;amet=consectetur
         * </listing>
         */
        Url.prototype.getQuery = function () {
            if (this._variables) {
                var query = '';
                for (var i in this._variables) {
                    if (this._variables.hasOwnProperty(i)) {
                        if (query.length > 0) {
                            query += '&';
                        }
                        query += i + '=' + this._variables[i];
                    }
                }
                return query;
            }
            return null;
        };
        /**
         * @private
         */
        Url.prototype.setQuery = function (value) {
            if (!value) {
                this._variables = null;
            }
            else {
                try {
                    this._variables = {};
                    var variables = value.split('&');
                    var variable;
                    for (var i = 0; i < variables.length; i++) {
                        variable = variables[i].split('=');
                        if (variable.length > 1) {
                            this._variables[variable[0]] = variable[1];
                        }
                        else {
                            this._variables[variable[0]] = '';
                        }
                    }
                    console.log(this._variables);
                }
                catch (error) {
                }
            }
        };
        /**
         * The value after the hash (#)
         *
         * @example
         * <listing version="3.0">
         * #hash
         * </listing>
         */
        Url.prototype.getHash = function () {
            var length = this._hashList ? this._hashList.length : 0;
            if (!length) {
                return null;
            }
            else if (length == 1) {
                return this._hashList[0];
            }
            else {
                var hash = '';
                for (var i = 0; i < length; i++) {
                    hash += '/' + (this._hashList[i] || '-');
                }
                return hash;
            }
        };
        /**
         * Set the hash of the Url
         */
        Url.prototype.setHash = function (value) {
            if (value) {
                if (value.charAt(0) == "/") {
                    value = value.substr(1);
                }
                this._hashList = value.split("/");
            }
            else {
                this._hashList = null;
            }
            return this;
        };
        /**
         * List of the elements of the hash (splitted by '/')
         */
        Url.prototype.getHashList = function () {
            return this._hashList;
        };
        /**
         * Returns a part of the hash
         */
        Url.prototype.getHashPart = function (index) {
            return index < this._hashList.length ? this._hashList[index] : null;
        };
        /**
         * Set one part of the hash
         */
        Url.prototype.setHashPart = function (index, value) {
            this._hashList = this._hashList ? this._hashList : new Array(index + 1);
            if (index >= this._hashList.length) {
                this._hashList.length = index + 1;
            }
            this._hashList[index] = value;
            return this;
        };
        /**
         * A Boolean which indicates if this is an absolute Url
         *
         * @example
         * <listing version="3.0">
         * http://www.domain.com/index.html
         * </listing>
         */
        Url.prototype.isAbsolute = function () {
            return this._protocol != null;
        };
        /**
         * A Boolean which indicates if this is a relative Url
         *
         * @example
         * <listing version="3.0">
         * /index.html#value/1
         * </listing>
         */
        Url.prototype.isRelative = function () {
            return this._protocol == null;
        };
        /**
         * A Boolean which indicates if this is a secure Url.
         *
         * Only https and sftp are secure.
         */
        Url.prototype.isSecure = function () {
            return this._protocol == Url.HTTPS || this._protocol == Url.SFTP;
        };
        /**
         * The postfix for a Url, including protocol, : and (if needed) slashes.
         *
         * @example
         * <listing version="3.0">
         * http://
         * ftp://
         * mailto:
         * </listing>
         */
        Url.prototype.getScheme = function () {
            switch (this._protocol) {
                case null:
                    return null;
                case Url.HTTP:
                case Url.HTTPS:
                case Url.FTP:
                case Url.SFTP:
                case Url.FILE:
                    return this._protocol + '://';
                case Url.MAILTO:
                default:
                    return this._protocol + ':';
            }
        };
        /**
         * @private
         */
        Url.prototype.setScheme = function (value) {
            this._protocol = value ? value.split(":")[0] : null;
        };
        Url.prototype.getUsername = function () {
            return this._username;
        };
        /**
         * @private
         */
        Url.prototype.setUsername = function (value) {
            this._username = value;
        };
        Url.prototype.getPassword = function () {
            return this._password;
        };
        /**
         * @private
         */
        Url.prototype.setPassword = function (value) {
            this._password = value;
        };
        /**
         * Authentication for FTP as {username}:{password}
         *
         * @example
         * <listing version="3.0">
         * thijs:AbCdE
         * </listing>
         */
        Url.prototype.getAuthentication = function () {
            if (this._protocol != Url.MAILTO && this._username) {
                if (this._password) {
                    return this._username + ":" + this._password;
                }
                else {
                    return this._username;
                }
            }
            return null;
        };
        /**
         * @private
         */
        Url.prototype.setAuthentication = function (value) {
            if (value) {
                var a = value.split(':');
                this._username = a[0];
                this._password = a[1];
            }
            else {
                this._username = null;
                this._password = null;
            }
        };
        /**
         * The email address of a mailto link.
         *
         * @example
         * <listing version="3.0">
         * mailto:thijs[at]mediamonks.com
         * </listing>
         */
        Url.prototype.getEmail = function () {
            return this._protocol == Url.MAILTO && this._username && this._domain ? this._username + "@" + this._domain : null;
        };
        /**
         * @private
         */
        Url.prototype.setEmail = function (value) {
            this._protocol = Url.MAILTO;
            if (value) {
                var temp = value.split("@");
                this._username = temp[0];
                this._domain = temp[1];
            }
        };
        /**
         * Hypertext Transfer Protocol
         */
        Url.HTTP = "http";
        /**
         * HTTP Secure
         */
        Url.HTTPS = "https";
        /**
         * File Transfer Protocol
         */
        Url.FTP = "ftp";
        /**
         * Secure File Transfer Protocol
         */
        Url.SFTP = "sftp";
        /**
         * Local file
         */
        Url.FILE = "file";
        /**
         * Urls of this form are intended to be used to open the new message window of the user's email client when the
         * Url is activated, with the address as defined by the Url in the "To:" field.
         */
        Url.MAILTO = "mailto";
        return Url;
    })();
    return Url;
});
