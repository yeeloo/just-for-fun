define(["require", "exports", 'lib/gaia/api/Gaia'], function (require, exports, Gaia) {
    /**
     * @module Gaia
     * @namespace gaia.flow
     * @class FlowManager
     */
    var FlowManager = (function () {
        function FlowManager() {
        }
        /**
         * @public
         * @static
         * @method init
         * @param {string} type
         */
        FlowManager.init = function (type) {
            FlowManager.flow = NormalFlow;
        };
        /**
         * from GaiaHQ to flow
         *
         * @public
         * @static
         * @method afterGoto
         */
        FlowManager.afterGoto = function () {
            FlowManager.flow.start();
        };
        /**
         * @public
         * @static
         * @method afterTransitionOutDone
         */
        FlowManager.afterTransitionOutDone = function () {
            FlowManager.flow.afterTransitionOutDone();
        };
        /**
         * @public
         * @static
         * @method afterPreloadDone
         */
        FlowManager.afterPreloadDone = function () {
            FlowManager.flow.afterPreloadDone();
        };
        /**
         * @public
         * @static
         * @method afterTransitionDone
         */
        FlowManager.afterTransitionDone = function () {
            FlowManager.flow.afterTransitionDone();
        };
        /**
         * @public
         * @static
         * @method afterTransitionInDone
         */
        FlowManager.afterTransitionInDone = function () {
            FlowManager.flow.afterTransitionInDone();
        };
        // from flow
        // to GaiaHQ
        /**
         * @public
         * @static
         * @method transitionOut
         */
        FlowManager.transitionOut = function () {
            Gaia.hq.beforeTransitionOut();
        };
        /**
         * @public
         * @static
         * @method preload
         */
        FlowManager.preload = function () {
            Gaia.hq.beforePreload();
        };
        /**
         * @public
         * @static
         * @method transition
         */
        FlowManager.transition = function () {
            Gaia.hq.beforeTransition();
        };
        /**
         * @public
         * @static
         * @method transitionIn
         */
        FlowManager.transitionIn = function () {
            Gaia.hq.beforeTransitionIn();
        };
        /**
         * @public
         * @static
         * @method complete
         */
        FlowManager.complete = function () {
            Gaia.hq.afterComplete();
        };
        // from SiteController
        // to GaiaHQ
        /**
         * @public
         * @static
         * @method start
         */
        FlowManager.start = function () {
            Gaia.hq.afterGoto();
        };
        /**
         * @public
         * @static
         * @method transitionOutComplete
         */
        FlowManager.transitionOutComplete = function () {
            Gaia.hq.afterTransitionOut();
        };
        /**
         * @public
         * @static
         * @method preloadComplete
         */
        FlowManager.preloadComplete = function () {
            Gaia.hq.afterPreload();
        };
        /**
         * @public
         * @static
         * @method transitionComplete
         */
        FlowManager.transitionComplete = function () {
            Gaia.hq.afterTransition();
        };
        /**
         * @public
         * @static
         * @method transitionInComplete
         */
        FlowManager.transitionInComplete = function () {
            Gaia.hq.afterTransitionIn();
        };
        return FlowManager;
    })();
    /**
     * @class NormalFlow
     */
    var NormalFlow = (function () {
        function NormalFlow() {
        }
        /**
         * @public
         * @static
         * @method start
         */
        NormalFlow.start = function () {
            FlowManager.preload();
        };
        /**
         * @public
         * @static
         * @method afterPreloadDone
         */
        NormalFlow.afterPreloadDone = function () {
            FlowManager.transitionOut();
        };
        /**
         * @public
         * @static
         * @method afterTransitionOutDone
         */
        NormalFlow.afterTransitionOutDone = function () {
            FlowManager.transition();
        };
        /**
         * @public
         * @static
         * @method afterTransitionDone
         */
        NormalFlow.afterTransitionDone = function () {
            FlowManager.transitionIn();
        };
        /**
         * @public
         * @static
         * @method afterTransitionInDone
         */
        NormalFlow.afterTransitionInDone = function () {
            FlowManager.complete();
        };
        return NormalFlow;
    })();
    /**
     * @class PreloadFlow
     */
    var PreloadFlow = (function () {
        function PreloadFlow() {
        }
        /**
         * @public
         * @static
         * @method start
         */
        PreloadFlow.start = function () {
            FlowManager.transitionOut();
        };
        /**
         * @public
         * @static
         * @method afterTransitionOutDone
         */
        PreloadFlow.afterTransitionOutDone = function () {
            FlowManager.preload();
        };
        /**
         * @public
         * @static
         * @method afterPreloadDone
         */
        PreloadFlow.afterPreloadDone = function () {
            FlowManager.transition();
        };
        /**
         * @public
         * @static
         * @method afterTransitionDone
         */
        PreloadFlow.afterTransitionDone = function () {
            FlowManager.transitionIn();
        };
        /**
         * @public
         * @static
         * @method afterTransitionInDone
         */
        PreloadFlow.afterTransitionInDone = function () {
            FlowManager.complete();
        };
        return PreloadFlow;
    })();
    /**
     * @class CrosslFlow
     */
    var CrosslFlow = (function () {
        function CrosslFlow() {
        }
        /**
         * @public
         * @static
         * @method start
         */
        CrosslFlow.start = function () {
            CrosslFlow.isInDone = CrosslFlow.isOutDone = false;
            FlowManager.preload();
        };
        /**
         * @public
         * @static
         * @method afterPreloadDone
         */
        CrosslFlow.afterPreloadDone = function () {
            FlowManager.transition();
            FlowManager.transitionOut();
            FlowManager.transitionIn();
        };
        /**
         * @public
         * @static
         * @method afterTransitionDone
         */
        CrosslFlow.afterTransitionDone = function () {
        };
        /**
         * @public
         * @static
         * @method afterTransitionInDone
         */
        CrosslFlow.afterTransitionInDone = function () {
            CrosslFlow.isInDone = true;
            CrosslFlow.checkBothDone();
        };
        /**
         * @public
         * @static
         * @method afterTransitionOutDone
         */
        CrosslFlow.afterTransitionOutDone = function () {
            CrosslFlow.isOutDone = true;
            CrosslFlow.checkBothDone();
        };
        /**
         * @public
         * @static
         * @method checkBothDone
         */
        CrosslFlow.checkBothDone = function () {
            if (CrosslFlow.isInDone && CrosslFlow.isOutDone) {
                CrosslFlow.isInDone = CrosslFlow.isOutDone = false;
                FlowManager.complete();
            }
        };
        return CrosslFlow;
    })();
    return FlowManager;
});
