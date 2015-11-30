var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'knockout', 'lib/gaia/core/GaiaMain', 'app/control/StartUp', 'app/config/Routes', 'lib/gaia/api/Gaia', 'app/data/DataManager'], function (require, exports, ko, gm, StartUp, Routes, Gaia, DataManager) {
    /**
     * Where it all start
     *
     * @namespace app
     * @class Main
     * @extend gaia.core.GaiaMain
     */
    var Main = (function (_super) {
        __extends(Main, _super);
        /**
         * @method constructor
         * @param {app.config.GaiaSitemap} siteconfig
         */
        function Main(siteconfig) {
            var _this = this;
            _super.call(this);
            var routes = new Routes();
            routes.setup();
            this._startUp = new StartUp();
            this._startUp.execute(function () {
                _this.startGaia(siteconfig);
                _this._startUp.afterGaia();
            });
        }
        /**
         * @method onInit
         */
        Main.prototype.onInit = function () {
            _super.prototype.onInit.call(this, function (startRoute, validBranch) {
                //			console.log('onInit: ', [startRoute, validBranch, Gaia.api.getCurrentBranch()]);
                // here you can change the startRoute for gaia
                // the startRoute param is the current deeplink
                // NOTE: this is the ROUTE, not the validBRANCH
                return startRoute;
            });
            window['ko'] = ko;
            // check pages for auth
            this._beforeGotoHijack = Gaia.api.beforeGoto(this.onBeforeGoto.bind(this), true);
        };
        /**
         * @method onBeforeGoto
         * @param {gEvents.GaiaEvent} event
         */
        Main.prototype.onBeforeGoto = function (event) {
            var dataManager = DataManager.getInstance();
            var pageData = Gaia.api.getPage(event.routeResult[0].branch).data || {};
            var isAuthenticated = true;
            // check if we are on a user page, but are not loggedin
            // this could happen when going to a deeplink or using the browsers back button
            if (pageData.hasOwnProperty('auth') && pageData.auth == true && isAuthenticated) {
                // not allowed, goto home
                Gaia.api.goto('/index');
            }
            else if (pageData.hasOwnProperty('ifAuthenticated') && isAuthenticated) {
                Gaia.api.goto(pageData.ifAuthenticated);
            }
            else {
                // allowed, just continue
                this._beforeGotoHijack();
            }
            //todo: add 'current' class to the current active page (leaf)
        };
        return Main;
    })(gm.GaiaMain);
    return Main;
});
