var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'app/page/DefaultViewModel', 'knockout'], function (require, exports, DefaultViewModel, ko) {
    /**
     * HomeViewModel
     *
     * @namespace app.page
     * @class HomeViewModel
     * @extend app.page.DefaultViewModel
     */
    var HomeViewModel = (function (_super) {
        __extends(HomeViewModel, _super);
        function HomeViewModel() {
            _super.call(this);
            this.active = ko.observable('');
            this.items = ko.observableArray([]);
            this.popups = ko.observableArray([]);
        }
        HomeViewModel.prototype.destruct = function () {
            this.active = null;
            this.items = null;
            this.popups = null;
            _super.prototype.destruct.call(this);
        };
        return HomeViewModel;
    })(DefaultViewModel);
    return HomeViewModel;
});
