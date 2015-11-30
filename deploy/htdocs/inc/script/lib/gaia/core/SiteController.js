var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/gaia/core/GaiaHQ', 'lib/gaia/core/BranchTools', 'lib/gaia/core/BranchLoader', 'lib/gaia/core/BranchManager', 'lib/gaia/core/SiteModel', 'lib/gaia/core/TransitionController', 'lib/gaia/flow/FlowManager', 'lib/gaia/events/GaiaEvents', 'lib/temple/events/EventDispatcher', 'lib/temple/events/CommonEvent'], function (require, exports, GaiaHQ, BranchTools, BranchLoader, BranchManager, SiteModel, TransitionController, FlowManager, gEvents, EventDispatcher, CommonEvent) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class BranchManager
     * @extends temple.events.EventDispatcher
     */
    var SiteController = (function (_super) {
        __extends(SiteController, _super);
        function SiteController(sv) {
            _super.call(this);
            this.transitionController = new TransitionController();
            this.branchLoader = new BranchLoader();
            this.queuedBranch = "";
            this.queuedFlow = "";
            this.siteView = sv;
            //preloadController = new PreloadController(null, preloader);
            //preloadController.addEventListener(PreloadController.READY, onPreloaderReady, false, 1);
            //preloadController.addEventListener(Event.COMPLETE, onPreloadComplete);
            this.branchLoader.addEventListener(gEvents.BranchLoaderEvent.LOAD_PAGE, this.onLoadPage);
            this.branchLoader.addEventListener(gEvents.BranchLoaderEvent.LOAD_ASSET, this.onLoadAsset);
            //this.branchLoader.addEventListener(BranchLoaderEvent.START, this.preloadController.onStart);
            //this.branchLoader.addEventListener(AssetEvent.ASSET_PROGRESS, preloadController.onProgress);
            //this.branchLoader.addEventListener(Event.COMPLETE, preloadController.onComplete);
            this.branchLoader.addEventListener(CommonEvent.COMPLETE, this.onPreloadComplete.bind(this));
            this.transitionController.addEventListener(gEvents.PageEvent.TRANSITION_OUT_COMPLETE, this.onTransitionOutComplete);
            this.transitionController.addEventListener(gEvents.PageEvent.TRANSITION_IN_COMPLETE, this.onTransitionInComplete);
            this.transitionController.addEventListener(gEvents.PageEvent.TRANSITION_COMPLETE, this.onTransitionComplete);
        }
        SiteController.getCurrentBranch = function () {
            return SiteController.currentBranch;
        };
        SiteController.getCurrentRoute = function () {
            return SiteController.currentRoute;
        };
        //public static getPreloader():PreloadController
        //{
        //	return preloadController;
        //}
        SiteController.getBusy = function () {
            return SiteController.isTransitioning || SiteController.isLoading;
        };
        // GAIAHQ RECEIVER
        SiteController.prototype.onGoto = function (event) {
            BranchManager.cleanup();
            var validBranch = event.routeResult[0].branch;
            if (!event.external) {
                if (validBranch != SiteController.currentBranch) {
                    if (!SiteController.isTransitioning && !SiteController.isLoading) {
                        this.queuedBranch = "";
                        this.queuedFlow = "";
                        var flow;
                        if (event.flow == null) {
                            if (!SiteModel.getTree().active && SiteModel.getIndexFirst()) {
                                // first just load the index
                                SiteController.currentBranch = SiteModel.getIndexID();
                            }
                            else {
                                // need to get the branch root page that will transition in to determine flow
                                var prevArray = BranchTools.getPagesOfBranch(SiteController.currentBranch);
                                var newArray = BranchTools.getPagesOfBranch(validBranch);
                                var i;
                                for (i = 0; i < newArray.length; i++) {
                                    if (newArray[i] != prevArray[i]) {
                                        break;
                                    }
                                }
                                if (newArray[i] == null || newArray[i] == undefined) {
                                }
                                else {
                                }
                                SiteController.currentBranch = validBranch;
                            }
                        }
                        else {
                            flow = event.flow;
                            SiteController.currentBranch = validBranch;
                        }
                        FlowManager.init(flow);
                        FlowManager.start();
                    }
                    else {
                        this.queuedBranch = event.routeResult[0].branch;
                        this.queuedFlow = event.flow;
                        if (!SiteController.isLoading) {
                            this.transitionController.interrupt();
                        }
                        else {
                            this.branchLoader.interrupt();
                        }
                    }
                }
            }
            else {
            }
        };
        // BRANCH LOADER EVENT LISTENERS
        SiteController.prototype.onLoadPage = function (event) {
            SiteController.isLoading = true;
            var page = event.asset;
            BranchManager.addPage(page);
            //siteView.addPage(page);
            page.preload();
        };
        SiteController.prototype.onLoadAsset = function (event) {
            SiteController.isLoading = true;
            //if (event.asset is DisplayObjectAsset) siteView.addAsset(event.asset as DisplayObjectAsset);
            //if (event.asset.preloadAsset) event.asset.preload();
        };
        // GAIAHQ EVENT LISTENERS
        SiteController.prototype.onTransitionOut = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transitionOut(BranchManager.getTransitionOutArray(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onTransitionIn = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transitionIn(BranchTools.getPagesOfBranch(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onTransition = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transition(BranchManager.getTransitionOutArray(SiteController.currentBranch), BranchTools.getPagesOfBranch(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onPreload = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isLoading = true;
                this.branchLoader.loadBranch(SiteController.currentBranch);
            }
        };
        SiteController.prototype.onComplete = function (event) {
            this.checkQueuedBranch();
        };
        SiteController.prototype.onPreloadComplete = function (event) {
            SiteController.isLoading = false;
            FlowManager.preloadComplete();
            //this.siteView.preloader.addEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
        };
        // TRANSITION CONTROLLER EVENT LISTENERS
        SiteController.prototype.onTransitionOutComplete = function (event) {
            BranchManager.cleanup();
            FlowManager.transitionOutComplete();
        };
        SiteController.prototype.onTransitionInComplete = function (event) {
            BranchManager.cleanup();
            FlowManager.transitionInComplete();
        };
        SiteController.prototype.onTransitionComplete = function (event) {
            BranchManager.cleanup();
            FlowManager.transitionComplete();
        };
        // UTILITY FUNCTIONS
        SiteController.prototype.checkQueuedBranch = function () {
            SiteController.isLoading = SiteController.isTransitioning = false;
            if (this.queuedBranch.length > 0) {
                this.redirect();
                return true;
            }
            return false;
        };
        SiteController.prototype.redirect = function () {
            // Waiting one frame makes this more stable when spamming goto events
            //this.siteView.addEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
            GaiaHQ.getInstance().goto(this.queuedBranch, {}, this.queuedFlow);
        };
        SiteController.prototype.onPreloaderReady = function (event) {
            //this.preloadController.removeEventListener(Event.COMPLETE, onPreloaderReady);
            //if (this.PreloadController(event.target).asset) this.siteView.preloader.addChild(PreloadController(event.target).asset.loader);
            ////siteView.preloader.addChild(DisplayObject(preloadController.clip));
        };
        // EnterFrame functions
        SiteController.prototype.preloaderEnterFrame = function (event) {
            FlowManager.preloadComplete();
            //this.siteView.preloader.removeEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
        };
        SiteController.prototype.siteViewEnterFrame = function (event) {
            GaiaHQ.getInstance().goto(this.queuedBranch, {}, this.queuedFlow);
            //this.siteView.removeEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
        };
        //private static preloadController:PreloadController;
        SiteController.currentBranch = "";
        SiteController.currentRoute = "";
        SiteController.isTransitioning = false;
        SiteController.isLoading = false;
        return SiteController;
    })(EventDispatcher);
    return SiteController;
});
