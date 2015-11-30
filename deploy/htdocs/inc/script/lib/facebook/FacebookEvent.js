var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/events/BaseEvent"], function (require, exports, BaseEvent) {
    var FacebookEvent = (function (_super) {
        __extends(FacebookEvent, _super);
        function FacebookEvent(type) {
            _super.call(this, type);
        }
        FacebookEvent.LOGIN = "FacebookEvent.login";
        FacebookEvent.LOGOUT = "FacebookEvent.logout";
        return FacebookEvent;
    })(BaseEvent);
    return FacebookEvent;
});
