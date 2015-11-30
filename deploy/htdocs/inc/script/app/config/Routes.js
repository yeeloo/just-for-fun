define(["require", "exports", 'lib/gaia/api/Gaia', 'app/data/enum/Page'], function (require, exports, Gaia, Page) {
    /**
     * Set up your routes here. See lib.gaia.router.GaiaRouter
     * or http://www.devmonks.nl/m/mediamonks/frontend/gaia/docs/docs-sitemap-and-routing
     * for more info.
     *
     * @namespace app.control
     * @class Routes
     */
    var Routes = (function () {
        function Routes() {
            Gaia.router.config().assert('id', '^\\d+$');
        }
        Routes.prototype.setup = function () {
            //Gaia.router.redirect('/terms', '/info');
            Gaia.router.page('/', Page.HOME);
            Gaia.router.page('/knockout', Page.KNOCKOUT);
            //			.redirectOnLanding('/info');
            Gaia.router.page('/info', Page.INFO);
            Gaia.router.page('/contact', Page.INFO);
            Gaia.router.page('/about', Page.INFO);
            Gaia.router.page('/test1/:id/:slug', Page.HOME + '/test1');
            Gaia.router.page('/detail/:id/:slug', Page.DETAIL);
            Gaia.router.page('/video/:videoId/:slug', Page.VIDEO).assert('id', '^\\d+$').assert('assert', '^\\w+$');
            Gaia.router.page('/about', Page.HOME + '/' + Page.POPUP_ABOUT);
            Gaia.router.page('/privacy', Page.HOME + '/' + Page.POPUP_PRIVACY);
            Gaia.router.page('/canvas', Page.CANVAS);
            Gaia.router.page('/video/:id/:slug/about/:id', Page.VIDEO + '/' + Page.POPUP_ABOUT);
        };
        return Routes;
    })();
    return Routes;
});
