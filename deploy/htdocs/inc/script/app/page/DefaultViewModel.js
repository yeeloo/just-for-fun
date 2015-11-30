var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/gaia/assets/AbstractPageViewModel'], function (require, exports, AbstractPageViewModel) {
    /**
     * DefaultViewModel
     *
     * @class DefaultViewModel
     * @extend gaia.assets.AbstractPageViewModel
     */
    var DefaultViewModel = (function (_super) {
        __extends(DefaultViewModel, _super);
        function DefaultViewModel() {
            _super.call(this);
        }
        return DefaultViewModel;
    })(AbstractPageViewModel);
    return DefaultViewModel;
});
