var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/createjs/easeljs/component/EventDispatcher', 'lib/temple/utils/Browser', 'lib/temple/utils/types/StringUtils'], function (require, exports, EventDispatcher, Browser, StringUtils) {
    var Request = (function (_super) {
        __extends(Request, _super);
        function Request(options) {
            _super.call(this);
            this._xhr = Browser.getXhr();
            this._headers = $.extend({}, Request.defaultOptions.headers);
            this._options = {};
            this.running = false;
            this.setOptions(options);
        }
        Request.empty = function () {
        };
        Request.stripScripts = function (exec) {
            var scripts = '';
            var text = exec.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function (all, code) {
                scripts += code + '\n';
                return '';
            });
            if (exec === true) {
                Browser.exec(scripts);
            }
            else if (typeOf(exec) == 'function') {
                exec(scripts, text);
            }
            return text;
        };
        Request.prototype.setOptions = function (options) {
            for (var name in Request.defaultOptions) {
                if (Request.defaultOptions.hasOwnProperty(name)) {
                    switch (name) {
                        case 'onComplete':
                        case 'onSuccess':
                        case 'onCancel':
                        case 'onProgress':
                        case 'onFailure':
                        case 'onException':
                        case 'onTimeout':
                            {
                                if (options[name]) {
                                    this.addEventListener(name.substr(2).toLowerCase(), options[name]);
                                }
                                break;
                            }
                        default:
                            {
                                this._options[name] = options[name] || Request.defaultOptions[name];
                                break;
                            }
                    }
                }
            }
        };
        Request.prototype.onStateChange = function () {
            var xhr = this._xhr;
            if (xhr.readyState != 4 || !this.running) {
                return;
            }
            this.running = false;
            this.status = 0;
            try {
                var status = xhr.status;
                this.status = (status == 1223) ? 204 : status;
            }
            catch (e) {
            }
            xhr.onreadystatechange = Request.empty;
            if (Request.progressSupport) {
                xhr.onprogress = xhr.onloadstart = Request.empty;
            }
            clearTimeout(this.timer);
            this.response = { text: this._xhr.responseText || '', xml: this._xhr.responseXML };
            if (this._isSuccess()) {
                this.success(this.response.text, this.response.xml);
            }
            else {
                this.failure();
            }
        };
        Request.prototype._isSuccess = function () {
            var status = this.status;
            return (status >= 200 && status < 300);
        };
        Request.prototype.isRunning = function () {
            return !!this.running;
        };
        Request.prototype.processScripts = function (text) {
            if (this._options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) {
                return Browser.exec(text);
            }
            return text.stripScripts(this._options.evalScripts);
        };
        Request.prototype.success = function (text, xml) {
            this.dispatchEvent('success', this.processScripts(text), xml);
        };
        Request.prototype.onSuccess = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.dispatchEvent.apply(this, args.slice(0).unshift('complete'));
            this.dispatchEvent.apply(this, args.slice(0).unshift('success'));
        };
        Request.prototype.failure = function () {
            this.onFailure();
        };
        Request.prototype.onFailure = function () {
            this.dispatchEvent('complete');
            this.dispatchEvent('failure', this._xhr);
        };
        Request.prototype.loadstart = function (event) {
            this.dispatchEvent('loadstart', event, this._xhr);
        };
        Request.prototype.progress = function (event) {
            this.dispatchEvent('progress', event, this._xhr);
        };
        Request.prototype.timeout = function () {
            this.dispatchEvent('timeout', this._xhr);
        };
        Request.prototype.setHeader = function (name, value) {
            this._headers[name] = value;
            return this;
        };
        Request.prototype.getHeader = function (name) {
            try {
                return this._xhr.getResponseHeader(name);
            }
            catch (e) {
                return null;
            }
        };
        Request.prototype.check = function (options) {
            if (!this.running) {
                return true;
            }
            //		switch(this._options.link)
            //		{
            //			case 'cancel':
            //				this.cancel();
            //				return true;
            //			case 'chain':
            //				this.chain(this.caller.pass(arguments, this));
            //				return false;
            //		}
            return false;
        };
        Request.prototype.send = function (options) {
            //		if(!this.check(options))
            //		{
            //			return this;
            //		}
            var _this = this;
            if (options === void 0) { options = {}; }
            //		this._options.isSuccess = this._options.isSuccess || this.isSuccess;
            this.running = true;
            //		var type = typeOf(options);
            //		if(type == 'string' || type == 'element')
            //		{
            //			options = {data: options};
            //		}
            var old = this._options;
            options = $.extend({ data: old.data, url: old.url, method: old.method }, options);
            var data = options.data, url = String(options.url), method = options.method.toLowerCase();
            switch (typeOf(data)) {
                case 'object':
                case 'hash':
                    data = Object.toQueryString(data);
            }
            if (this._options.format) {
                var format = 'format=' + this._options.format;
                data = (data) ? format + '&' + data : format;
            }
            if (this._options.emulation && !(['get', 'post'].indexOf(method) > -1)) {
                var _method = '_method=' + method;
                data = (data) ? _method + '&' + data : _method;
                method = 'post';
            }
            if (this._options.urlEncoded && ['post', 'put'].contains(method)) {
                var encoding = (this._options.encoding) ? '; charset=' + this._options.encoding : '';
                this._headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
            }
            if (!url) {
                url = document.location.pathname;
            }
            var trimPosition = url.lastIndexOf('/');
            if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) {
                url = url.substr(0, trimPosition);
            }
            if (this._options.noCache) {
                url += (url.indexOf('?') > -1 ? '&' : '?') + StringUtils.uniqueID();
            }
            if (data && method == 'get') {
                url += (url.indexOf('?') > -1 ? '&' : '?') + data;
                data = null;
            }
            var xhr = this._xhr;
            if (Request.progressSupport) {
                xhr.onloadstart = this.dispatchEvent.bind(this, 'loadstart');
                xhr.onprogress = this.dispatchEvent.bind(this, 'progress');
            }
            xhr.open(method.toUpperCase(), url, this._options.async, this._options.user, this._options.password);
            if (this._options.user && 'withCredentials' in xhr) {
                xhr.withCredentials = true;
            }
            xhr.onreadystatechange = this.onStateChange.bind(this);
            for (var o in this._headers) {
                if (this._headers.hasOwnProperty(o)) {
                    try {
                        xhr.setRequestHeader(o, this._headers[o]);
                    }
                    catch (e) {
                        this.dispatchEvent('exception', [o, this._headers[o]]);
                    }
                }
            }
            this.dispatchEvent('request');
            xhr.send(data);
            if (!this._options.async) {
                this.onStateChange();
            }
            else if (this._options.timeout) {
                this.timer = setTimeout(function () { return _this.timeout(); }, this._options.timeout);
            }
            return this;
        };
        Request.prototype.cancel = function () {
            if (!this.running) {
                return this;
            }
            this.running = false;
            var xhr = this._xhr;
            xhr.abort();
            clearTimeout(this.timer);
            xhr.onreadystatechange = Request.empty;
            if (Request.progressSupport) {
                xhr.onprogress = xhr.onloadstart = Request.empty;
            }
            this._xhr = Browser.getXhr();
            this.dispatchEvent('cancel');
            return this;
        };
        Request.defaultOptions = {
            url: '',
            data: '',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
            },
            async: true,
            format: false,
            method: 'post',
            link: 'ignore',
            isSuccess: null,
            emulation: true,
            urlEncoded: true,
            encoding: 'utf-8',
            evalScripts: false,
            evalResponse: false,
            timeout: 0,
            noCache: false,
            onComplete: Request.empty,
            onSuccess: Request.empty,
            onCancel: Request.empty,
            onProgress: Request.empty,
            onFailure: Request.empty,
            onException: Request.empty,
            onTimeout: Request.empty
        };
        Request.progressSupport = ('onprogress' in Browser.getXhr());
        return Request;
    })(EventDispatcher);
    return Request;
});
