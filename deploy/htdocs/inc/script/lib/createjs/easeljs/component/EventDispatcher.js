define(["require", "exports"], function (require, exports) {
    /**
     * @author Mient-jan Stelling
     */
    var EventDispatcher = (function () {
        function EventDispatcher(_target) {
            if (_target === void 0) { _target = null; }
            this._target = _target;
            this._destructed = false;
            this._events = {};
            this._eventsSingle = {};
            if (!this._target) {
                this._target = this;
            }
        }
        EventDispatcher.prototype.throwAlreadyDestructed = function () {
            throw 'eventDispatcher already distructed';
        };
        EventDispatcher.prototype.emptyArray = function (arr) {
            while (arr.length > 0) {
                arr.pop();
            }
        };
        EventDispatcher.prototype.addEventListener = function (type, listener, single) {
            if (single === void 0) { single = false; }
            if (this._destructed) {
                this.throwAlreadyDestructed();
            }
            if (single) {
                if (!this._eventsSingle.hasOwnProperty(type)) {
                    this._eventsSingle[type] = [];
                }
                this._eventsSingle[type].push(listener);
            }
            else {
                if (!this._events.hasOwnProperty(type)) {
                    this._events[type] = [];
                }
                this._events[type].push(listener);
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this._destructed) {
                this.throwAlreadyDestructed();
            }
            if (this._events.hasOwnProperty(type)) {
                for (var i = 0, l = this._events[type].length; i < l; ++i) {
                    this._events[type][i].apply(this._target, args);
                }
            }
            if (this._eventsSingle.hasOwnProperty(type)) {
                for (var i = 0, l = this._eventsSingle[type].length; i < l; ++i) {
                    this._eventsSingle[type][i].apply(this._target, args);
                }
                this.emptyArray(this._eventsSingle[type]);
            }
        };
        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (this._destructed) {
                this.throwAlreadyDestructed();
            }
            if (typeof (type) == 'undefined') {
                for (var name in this._events) {
                    if (this._events.hasOwnProperty(name)) {
                        this.emptyArray(this._events[name]);
                        this._events[name] = null;
                    }
                }
                for (var name in this._eventsSingle) {
                    if (this._eventsSingle.hasOwnProperty(name)) {
                        this.emptyArray(this._eventsSingle[name]);
                        this._eventsSingle[name] = null;
                    }
                }
            }
            else {
                if (this._events.hasOwnProperty(type)) {
                    this.emptyArray(this._events[type]);
                }
                if (this._eventsSingle.hasOwnProperty(type)) {
                    this.emptyArray(this._eventsSingle[type]);
                }
            }
        };
        EventDispatcher.prototype.removeEventListener = function (type, fn) {
            if (this._destructed) {
                this.throwAlreadyDestructed();
            }
            if (this._events[type]) {
                for (var i = 0, l = this._events[type].length; i < l; ++i) {
                    if (this._events[type][i] === fn) {
                        this._events[type].splice(i, 1);
                        return;
                    }
                }
            }
            if (this._eventsSingle[type]) {
                for (var i = 0, l = this._eventsSingle[type].length; i < l; ++i) {
                    if (this._eventsSingle[type][i] === fn) {
                        this._eventsSingle[type].splice(i, 1);
                        return;
                    }
                }
            }
        };
        EventDispatcher.prototype.destruct = function () {
            if (this._destructed) {
                this.throwAlreadyDestructed();
            }
            this._destructed = true;
            this._events = null;
            this._eventsSingle = null;
        };
        return EventDispatcher;
    })();
    return EventDispatcher;
});
