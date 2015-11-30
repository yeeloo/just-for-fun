// todo: add automatich destruction of intervals, gateway PendingCalls, knockout subscriptions and components
define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.core
     * @class Destructible
     */
    var Destructible = (function () {
        function Destructible() {
            this._isDestructed = false;
            /**
             * @property eventNamespace
             * @type string
             * @default
             */
            this.eventNamespace = '';
            this.eventNamespace = '.' + (++Destructible.eventNamespaceCount);
        }
        Destructible.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        Destructible.prototype.destruct = function () {
            this._isDestructed = true;
        };
        Destructible.eventNamespaceCount = 10000000;
        return Destructible;
    })();
    return Destructible;
});
