var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/gaia/assets/AbstractPageController"], function (require, exports, AbstractPageController) {
    /**
     * CustomAbstractController
     *
     * @namespace app.page
     * @class CustomAbstractController
     * @extend gaia.assets.AbstractPageController
     */
    var CustomAbstractController = (function (_super) {
        __extends(CustomAbstractController, _super);
        /**
         * @constructor
         */
        function CustomAbstractController() {
            _super.call(this);
        }
        return CustomAbstractController;
    })(AbstractPageController);
    return CustomAbstractController;
});
