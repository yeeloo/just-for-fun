define(["require", "exports"], function (require, exports) {
    var GotoEventItem = (function () {
        function GotoEventItem() {
            this.flow = null;
            this.window = "_self";
            this.queryString = null;
            this.replace = false;
        }
        return GotoEventItem;
    })();
    return GotoEventItem;
});
