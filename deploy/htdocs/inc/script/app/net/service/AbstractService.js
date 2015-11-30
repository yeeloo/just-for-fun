define(["require", "exports"], function (require, exports) {
    var AbstractService = (function () {
        function AbstractService(gateway, debug) {
            this.gateway = gateway;
            this.debug = debug;
            if (!gateway)
                throw new Error("Gateway cannot be null");
        }
        return AbstractService;
    })();
    return AbstractService;
});
