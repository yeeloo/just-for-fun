define(["require", "exports", 'lib/gaia/api/Gaia', 'lib/gaia/core/GaiaHQ', 'lib/gaia/core/SiteModel', 'lib/gaia/core/SiteController', 'lib/gaia/core/SiteView', 'lib/gaia/events/GaiaEvents', 'app/util/Analytics'], function (require, exports, Gaia, GaiaHQ, SiteModel, SiteController, SiteView, gEvents, ga) {
    window['Gaia'] = Gaia;
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class GaiaMain
     */
    var GaiaMain = (function () {
        function GaiaMain() {
        }
        /**
         * @method startGaia
         * @param {?} siteConfig
         * @return {void}
         */
        GaiaMain.prototype.startGaia = function (siteConfig) {
            this._model = new SiteModel();
            this._model.load(siteConfig);
            this._controller = new SiteController(new SiteView());
            GaiaHQ.birth();
            Gaia.history.birth('');
            // lower prio than GaiaHistory listener
            GaiaHQ.getInstance().addEventListener(gEvents.GaiaEvent.GOTO, this._controller.onGoto.bind(this._controller));
            GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION_OUT, this._controller.onTransitionOut.bind(this._controller));
            GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION_IN, this._controller.onTransitionIn.bind(this._controller));
            GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION, this._controller.onTransition.bind(this._controller));
            GaiaHQ.getInstance().addEventListener(GaiaHQ.PRELOAD, this._controller.onPreload.bind(this._controller));
            GaiaHQ.getInstance().addEventListener(GaiaHQ.COMPLETE, this._controller.onComplete.bind(this._controller));
            //GaiaLite.GaiaHQ.getInstance().addListener(GaiaLite.GaiaEvent.AFTER_PRELOAD, initHistory, false, true);
            this.onInit();
        };
        GaiaMain.prototype.onInit = function (beforeStart) {
            if (beforeStart === void 0) { beforeStart = null; }
            ga.enableGaiaTracking(Gaia.api);
            var hq = GaiaHQ.getInstance();
            // higher prio than own HQ listener
            hq.addEventListener(gEvents.GaiaEvent.GOTO, Gaia.history.onGoto.bind(Gaia.history), 1);
            Gaia.history.addEventListener(gEvents.GaiaHistoryEvent.GOTO, hq.onGoto.bind(hq));
            Gaia.history.init(beforeStart);
            // gaia-goto bindings
            $('body').on('tap', '[data-gaia-popup-close]', function (event) {
                // close popups
                event.preventDefault();
                Gaia.api.closePopup();
            }).on('tap', 'a[href]', function (event) {
                // check for internal links and pass them to Gaia
                var target = $(event.currentTarget);
                // check requirements:
                // - check for self target
                // - check for other gaia actions
                // - check for url-match
                if ((!target.attr('target') || target.attr('target') == '_self') && !target.attr('data-gaia-goto') && !target.attr('data-gaia-popup') && !target.attr('data-gaia-goto-route') && !target.attr('data-gaia-popup-close') && target.attr('href').indexOf($('meta[name="document-base"]').attr('content')) != -1) {
                    event.preventDefault();
                    // get route from URL
                    var fullRoute = (target.attr('href').match(new RegExp($('meta[name="document-base"]').attr('content') + '(.*)', 'i')))[1];
                }
            });
        };
        return GaiaMain;
    })();
    exports.GaiaMain = GaiaMain;
});
