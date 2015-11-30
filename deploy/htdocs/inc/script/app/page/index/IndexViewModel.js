var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'app/page/DefaultViewModel', 'knockout'], function (require, exports, DefaultViewModel, ko) {
    /**
     * IndexViewModel
     *
     * @namespace app.page
     * @class IndexViewModel
     * @extend app.page.DefaultViewModel
     */
    var IndexViewModel = (function (_super) {
        __extends(IndexViewModel, _super);
        function IndexViewModel() {
            _super.call(this);
            this.active = ko.observable('');
            this.items = ko.observableArray([]);
            this.popups = ko.observableArray([]);
        }
        IndexViewModel.prototype.destruct = function () {
            this.active = null;
            this.items = null;
            this.popups = null;
            _super.prototype.destruct.call(this);
        };
        return IndexViewModel;
    })(DefaultViewModel);
    return IndexViewModel;
});
