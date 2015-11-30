var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "app/page/CustomAbstractController", 'lib/gaia/api/Gaia', 'lib/gaia/core/SiteModel'], function (require, exports, CustomAbstractController, Gaia, SiteModel) {
    /**
     * IndexController
     *
     * @namespace app.page
     * @class IndexController
     * @extend app.page.CustomAbstractController
     */
    var IndexController = (function (_super) {
        __extends(IndexController, _super);
        function IndexController() {
            _super.call(this);
        }
        IndexController.prototype.init = function () {
            _super.prototype.init.call(this);
            var routes = SiteModel.getRoutes();
            var popups = SiteModel.getXml().popups;
            for (var i = 0; i < popups.length; i++) {
                this.viewModel.popups.push(popups[i]);
            }
            for (var route in routes) {
                var page = Gaia.api.getPage(routes[route]);
                if (page.type != "popup") {
                    this.viewModel.items.push({
                        page: page,
                        route: route,
                        branch: routes[route],
                        active: page.getData('nav-highlight') || route
                    });
                }
            }
            this.updateNavigation(Gaia.api.getCurrentBranch());
        };
        IndexController.prototype.onDeeplink = function (event) {
            this.updateNavigation(event.routeResult[0].branch);
        };
        IndexController.prototype.updateNavigation = function (branch) {
            this.viewModel.active(Gaia.api.getPage(branch).getData('nav-highlight') || Gaia.api.getPage(branch).route);
        };
        IndexController.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return IndexController;
    })(CustomAbstractController);
    return IndexController;
});
