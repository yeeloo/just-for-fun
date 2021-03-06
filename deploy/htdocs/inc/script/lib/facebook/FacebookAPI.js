var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/facebook/FacebookResult", "lib/temple/events/CommonEvent", "lib/facebook/FacebookEvent"], function (require, exports, EventDispatcher, FacebookResult, CommonEvent, FacebookEvent) {
    var FacebookAPI = (function (_super) {
        __extends(FacebookAPI, _super);
        function FacebookAPI(debug) {
            if (debug === void 0) { debug = false; }
            _super.call(this);
            this.debug = debug;
        }
        FacebookAPI.prototype.init = function (applicationId, callback, version) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            if (version === void 0) { version = "v2.1"; }
            this.applicationId = applicationId;
            this._initCallback = callback;
            if (this.debug)
                console.log("Init, applicationId: " + applicationId);
            if (typeof window.fbAsyncInit !== "undefined") {
                throw "FacebookAPI already initialized, you can call this only once";
            }
            window.fbAsyncInit = function () {
                FB.Event.subscribe('auth.authResponseChange', _this.handleAuthResponseChange.bind(_this));
                FB.init({
                    appId: applicationId,
                    status: false,
                    xfbml: true,
                    version: version
                });
                FB.getLoginStatus(_this.handleAuthResponseChange.bind(_this));
            };
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        };
        FacebookAPI.prototype.login = function (callback, permissions) {
            if (callback === void 0) { callback = null; }
            if (permissions === void 0) { permissions = null; }
            if (this.debug)
                console.log("login:", permissions);
            if (!permissions)
                permissions = [];
            // Add default permissions
            if (this.permissions) {
                for (var i = 0; i < this.permissions.length; i++) {
                    if (permissions.indexOf(this.permissions[i]) == -1)
                        permissions.push(this.permissions[i]);
                }
            }
            // check if permissions are already allowed
            var login;
            if (this.isLoggedIn) {
                loop: for (var i = 0; i < permissions.length; i++) {
                    if (!this.isAllowed(permissions[i])) {
                        login = true;
                        break loop;
                    }
                }
            }
            if (!this.isLoggedIn || login) {
                // Add optional permissions
                if (this.optionalPermissions) {
                    for (var i = 0; i < this.optionalPermissions.length; i++) {
                        if (permissions.indexOf(this.optionalPermissions[i]) == -1)
                            permissions.push(this.optionalPermissions[i]);
                    }
                }
                FB.login(function (response) {
                    // TODO: check permissions
                    if (callback)
                        callback(new FacebookResult(true));
                }, { scope: permissions.join(",") });
            }
            else {
                if (this.debug)
                    console.log("login: all required permissions are already allowed, continue");
                if (callback)
                    callback(new FacebookResult(true));
            }
        };
        FacebookAPI.prototype.logout = function () {
            if (FB)
                FB.logout();
            this.isLoggedIn = false;
            this.authResponse = null;
            for (var permission in this._allowed) {
                delete this._allowed[permission];
            }
            if (this.hasEventListener(FacebookEvent.LOGOUT))
                this.dispatchEvent(new FacebookEvent(FacebookEvent.LOGOUT));
        };
        FacebookAPI.prototype.isAllowed = function (permission) {
            return this._allowed && (permission in this._allowed) && this._allowed[permission];
        };
        FacebookAPI.prototype.get = function (path, callback, params) {
            var _this = this;
            if (path === void 0) { path = null; }
            if (callback === void 0) { callback = null; }
            if (params === void 0) { params = null; }
            FB.api(path, 'get', params, function (response) {
                if (_this.debug)
                    console.log(path, response);
                var data = response;
                if ("data" in data) {
                    data = response.data;
                    if (data instanceof Array && data.length == 1) {
                        data = data[0];
                    }
                }
                if (callback)
                    callback(new FacebookResult(true, data));
            });
        };
        FacebookAPI.prototype.deleteObject = function (path, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            FB.api(path, "delete", function (response) {
                if (_this.debug)
                    console.log("delete", path, response);
                callback(new FacebookResult(response, response));
            });
        };
        FacebookAPI.prototype.ui = function (method, data, callback, display) {
            if (callback === void 0) { callback = null; }
            if (display === void 0) { display = 'popup'; }
            data['method'] = method;
            data['display'] = display;
            FB.ui(data, callback);
        };
        FacebookAPI.prototype.handleAuthResponseChange = function (response) {
            var _this = this;
            if (this.debug)
                console.log("authResponseChange:", response.status, response.authResponse);
            if (response && response.authResponse && this.authResponse && response.authResponse.accessToken == this.authResponse.accessToken) {
                // accessToken didn't change, so ignore this
                if (this.debug)
                    console.log("Same token, ignore");
                return;
            }
            this.status = response.status;
            this.authResponse = response.authResponse;
            this.isLoggedIn = this.authResponse && this.authResponse.userID != null;
            if (this.isLoggedIn) {
                // Check permissions
                FB.api("me/permissions", function (response) {
                    if (response && response.data && response.data instanceof Array) {
                        if (!_this._allowed)
                            _this._allowed = {};
                        var permissions = [];
                        var allowed = response.data[0];
                        for (var permission in allowed) {
                            _this._allowed[permission] = allowed[permission];
                            permissions.push(permission);
                        }
                        if (_this.debug)
                            console.log("allowed: " + permissions);
                        if (!_this.isInitialized) {
                            _this.isInitialized = true;
                            if (_this.debug)
                                console.log("initialized");
                            _this.dispatchEvent(new CommonEvent(CommonEvent.INIT));
                            if (_this._initCallback) {
                                _this._initCallback(new FacebookResult(true, _this.authResponse));
                                _this._initCallback = null;
                            }
                        }
                    }
                });
                if (this.hasEventListener(FacebookEvent.LOGIN))
                    this.dispatchEvent(new FacebookEvent(FacebookEvent.LOGIN));
            }
            else if (!this.isInitialized) {
                this.isInitialized = true;
                if (this.debug)
                    console.log("initialized");
                if (this.hasEventListener(CommonEvent.INIT))
                    this.dispatchEvent(new CommonEvent(CommonEvent.INIT));
                if (this._initCallback) {
                    this._initCallback(new FacebookResult(true, this.authResponse));
                    this._initCallback = null;
                }
            }
        };
        return FacebookAPI;
    })(EventDispatcher);
    return FacebookAPI;
});
