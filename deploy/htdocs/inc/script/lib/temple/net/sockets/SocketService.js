var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/EventDispatcher', 'lib/temple/net/sockets/SocketEvent'], function (require, exports, EventDispatcher, SocketEvent) {
    /**
     * @module Temple
     * @namespace temple.net.sockets
     * @class SocketService
     */
    var SocketService = (function (_super) {
        __extends(SocketService, _super);
        function SocketService(url, debug) {
            if (url === void 0) { url = null; }
            if (debug === void 0) { debug = true; }
            _super.call(this);
            this.url = url;
            this.debug = debug;
            this.uniqueCallbackId = 0;
            this._fallback = !window['WebSocket'];
            /*
             Socket reconnect strategy:
             Reconnecting is done in tiers.
        
             When a connection fails for the first time, the socket is reconnected with delay:
             $reconnectDelayTiers[$reconnectTier] + random(1-2)
        
             $reconnectTier = Math.min($reconnectTier + 1, $reconnectDelayTiers.length)
        
             when connection succeeds:
             $reconnectTier = 0
             */
            this.reconnectTier = 0;
            this.reconnectDelayTiers = [
                1000,
                6000,
                11000
            ];
        }
        SocketService.prototype.connect = function () {
            if (this.isConnected()) {
                // make sure we have disconnected
                if (this.debug)
                    console.error('SocketService::Connect::AlreadyConnected');
                return;
            }
            if (this.debug)
                console.log('SocketService::Connect');
            this.reconnectTier = 0;
            this.forceConnect();
        };
        SocketService.prototype.isConnected = function () {
            return typeof this.socket != 'undefined' && this.socket.readyState == SockJS.OPEN;
        };
        SocketService.prototype.disconnect = function () {
            clearTimeout(this.reconnectTimeout);
            if (typeof this.socket == 'undefined') {
                return;
            }
            if (this.debug)
                console.log('SocketService::Disconnect');
            // remove event listeners
            // prevents handleSocketClosed from firing
            // remove the event listener so it doesn't attempt to reconnect
            this.removeEventListeners(this.socket);
            var result = this.socket.close();
            if (this.debug)
                console.log('SocketService::Disconnect( ' + result + ' )');
            this.socket = undefined;
        };
        SocketService.prototype.send = function (type, action, data) {
            if (!this.isConnected())
                throw new Error("Not connected");
            var message = { t: type };
            if (typeof data != 'undefined') {
                message["d"] = data;
            }
            if (typeof action != 'undefined') {
                message["a"] = action;
            }
            if (this.debug) {
                console.log("send", message);
            }
            this.socket.send(JSON.stringify(message));
        };
        SocketService.prototype.request = function (action, data, callback) {
            var handler = this.addEventListener(SocketEvent.MESSAGE, function (event) {
                if (event.action == action) {
                    handler.destruct();
                    callback(event.data);
                }
            });
            this.send(REQUEST, action, data);
        };
        SocketService.prototype.forceConnect = function () {
            var _this = this;
            if (this.debug)
                console.log('SocketService::ForceConnect');
            if (!this.url)
                throw new Error("URL not set");
            this.dispatchEvent(new SocketEvent(SocketEvent.CONNECTING));
            if (DEBUG)
                console.log("Connect to url '" + this.url + (this._fallback ? "?fallback=1" : "") + "'");
            $.ajax((this.url + (this._fallback ? "?fallback=1" : "")), {
                timeout: 5000,
                dataType: "jsonp",
                jsonpCallback: "connectCallback"
            }).done(function (host) {
                if (host == "") {
                    _this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVER_AVAILABLE));
                    _this.reconnect();
                    if (_this.debug)
                        console.log('SocketService::NoServerAvailale');
                    return;
                }
                if (_this.debug)
                    console.log('SocketService::JSONPSuccess');
                if (!_this._protocol)
                    _this._protocol = _this.url.substr(0, _this.url.indexOf("://") + 3);
                _this.socket = new SockJS(_this._protocol + host + '/soccom', undefined, {
                    debug: false,
                    devel: true,
                    protocols_whitelist: _this.getProtocols()
                });
                _this.addEventListeners(_this.socket);
            }).error(function () {
                _this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVER_AVAILABLE));
                if (_this.debug)
                    console.log('SocketService::JSONPFailed');
                _this.reconnect();
            });
        };
        SocketService.prototype.getProtocols = function () {
            // check if browser supports websockets (if so, try to connect with websocket on the "main domain")
            return window['WebSocket'] && this._fallback === false ? ['websocket'] : ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'];
        };
        SocketService.prototype.reconnect = function () {
            var _this = this;
            clearTimeout(this.reconnectTimeout);
            var delay = this.reconnectDelayTiers[this.reconnectTier] + Math.round(Math.random() * 4000);
            if (this.debug)
                console.log('SocketService::Reconnect( ' + this.reconnectTier + ', ' + delay + ' )');
            this.reconnectTimeout = setTimeout(function () {
                _this.forceConnect();
            }, delay);
            this.dispatchEvent(new SocketEvent(SocketEvent.RECONNECT));
            this.reconnectTier = Math.min(this.reconnectTier + 1, this.reconnectDelayTiers.length - 1);
        };
        SocketService.prototype.addEventListeners = function (socket) {
            this.uniqueCallbackId = new Date().getTime();
            if (this.debug)
                console.log('SocketService::AddEventListeners( ' + this.uniqueCallbackId + ' )');
            this._handleSocketOpened = this.handleSocketOpened.bind(this, this.uniqueCallbackId);
            this._handleSocketMessage = this.handleSocketMessage.bind(this, this.uniqueCallbackId);
            this._handleSocketClosed = this.handleSocketClosed.bind(this, this.uniqueCallbackId);
            socket.addEventListener('open', this._handleSocketOpened);
            socket.addEventListener('message', this._handleSocketMessage);
            socket.addEventListener('close', this._handleSocketClosed);
        };
        SocketService.prototype.removeEventListeners = function (socket) {
            socket.removeEventListener('open', this._handleSocketOpened);
            socket.removeEventListener('message', this._handleSocketMessage);
            socket.removeEventListener('close', this._handleSocketClosed);
        };
        SocketService.prototype.handleSocketOpened = function (uniqueCallbackId) {
            if (uniqueCallbackId != this.uniqueCallbackId) {
                if (this.debug)
                    console.log('SocketService::Callback::Opened::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
                return;
            }
            if (this.debug) {
                console.log('SocketService::Callback::Opened::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
                console.log('SocketService::ConnectionOpened');
            }
            clearTimeout(this.reconnectTimeout);
            // reset the reconnect tier
            this.reconnectTier = 0;
            this.dispatchEvent(new SocketEvent(SocketEvent.OPENED));
        };
        SocketService.prototype.handleSocketClosed = function (uniqueCallbackId, e) {
            if (uniqueCallbackId != this.uniqueCallbackId) {
                if (this.debug)
                    console.log('SocketService::Callback::Closed::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
                return;
            }
            if (this.debug) {
                console.log('SocketService::Callback::Closed::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
                console.warn('SocketService::ConnectionClosed');
            }
            if (e && e.code === 2000) {
                // supplied protocols not supported
                this._fallback = true;
            }
            this.reconnect();
            this.dispatchEvent(new SocketEvent(SocketEvent.CLOSED));
        };
        SocketService.prototype.handleSocketMessage = function (uniqueCallbackId, e) {
            if (uniqueCallbackId != this.uniqueCallbackId) {
                if (this.debug)
                    console.warn('SocketService::Callback::Message::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
                return;
            }
            if (this.debug) {
                console.log('SocketService::HandleSocketMessage', e);
                console.log('SocketService::Callback::Message::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
            }
            var message = JSON.parse(e.data);
            if (this.debug)
                console.log(message.t + ": " + message.a, message.d);
            this.dispatchEvent(new SocketEvent(SocketEvent.MESSAGE, message.a, message.e, message.d, message.n ? new Date(message.n * 1000) : null));
        };
        return SocketService;
    })(EventDispatcher);
    var REQUEST = "request";
    return SocketService;
});
