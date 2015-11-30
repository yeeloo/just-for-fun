var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent) {
    /**
     * @module Temple
     * @namespace temple.net.sockets
     * @class SocketEvent
     */
    var SocketEvent = (function (_super) {
        __extends(SocketEvent, _super);
        /**
         * @class SocketEvent
         * @constructor
         * @param {string} type
         * @param {any} action
         * @param {any} event
         * @param {any} data
         * @param {Date} time
         */
        function SocketEvent(type, action, event, data, time) {
            if (action === void 0) { action = null; }
            if (event === void 0) { event = null; }
            if (data === void 0) { data = null; }
            if (time === void 0) { time = null; }
            _super.call(this, type);
            this.action = action;
            this.event = event;
            this.data = data;
            this.time = time;
        }
        /**
         * @static
         * @property CONNECTING
         * @type string
         */
        SocketEvent.CONNECTING = 'SocketEvent.connecting';
        /**
         * @static
         * @property OPENED
         * @type string
         */
        SocketEvent.OPENED = 'SocketEvent.opened';
        /**
         * @static
         * @property CLOSED
         * @type string
         */
        SocketEvent.CLOSED = 'SocketEvent.closed';
        /**
         * @static
         * @property RECONNECT
         * @type string
         */
        SocketEvent.RECONNECT = 'SocketEvent.reconnect';
        /**
         * @static
         * @property NO_SERVER_AVAILABLE
         * @type string
         */
        SocketEvent.NO_SERVER_AVAILABLE = 'SocketEvent.no_server_available';
        /**
         * @static
         * @property MESSAGE
         * @type string
         */
        SocketEvent.MESSAGE = 'SocketEvent.message';
        return SocketEvent;
    })(BaseEvent);
    return SocketEvent;
});
