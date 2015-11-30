define(["require", "exports", 'lib/gaia/core/GaiaHQ', 'lib/gaia/core/GaiaHistory', 'lib/gaia/router/GaiaRouter', 'lib/gaia/core/SiteController', 'lib/gaia/core/BranchTools', 'lib/gaia/events/GaiaEvents'], function (require, exports, GaiaHQ, GaiaHistory, GaiaRouter, SiteController, BranchTools, gEvents) {
    /**
     * GaiaJS is an JavaScript Framework designed to dramatically reduce development time.
     * It provides solutions to the challenges and repeated tasks we all face with front-end development, such as navigation, transitions, preloading, site structure and deep linking.
     * It provides speed and flexibility in your workflow and a simple API that gives you access to its powerful features.
     *
     *  Sitemap
     *  --------
     * 	define({
     * 		"title": "Gaia - {page}",
     * 		"config": {
     * 		    "controllerPath": "app/page/",
     * 		    "viewModelPath": "app/page/",
     * 		    "templatePath": "../../../../template/"
     * 		},
     * 		"routes": [
     * 		],
     * 		"pages": [
     * 		    {
     * 		        "id": "index",
     * 		        "title": "index",
     * 		        "pages": [
     * 		            {
     * 		                "id": "home",
     * 		                "title": "Home"
     * 		            }
     * 		        ]
     * 		    }
     * 		],
     * 		"popups": [
     * 		    {
     * 		        "id": "popup1",
     * 		        "title": "popup1"
     * 		    }
     * 		]
     * 	});
     *
     * @module Gaia
     */
    /**
     * @namespace gaia.api
     * @class GaiaImpl
     */
    var GaiaImpl = (function () {
        function GaiaImpl() {
        }
        /**
         * goto is the primary method you will be using in Gaia. It requires at least one argument and that is a string of the branch you want to navigate to.
         *
         * It has support for absolute paths, starting with a `/`, or relative paths. You can also use `./` or `../` to go a level up.<br>
         * The starting `/` is optional<br>
         * Starting with a `.` makes it relative<br>
         *
         * Starting with `index/home/detail`
         *
         *	index/foo        >> index/foo
         *	/index/foo       >> index/foo
         *	.                >> index/home/detail
         *	./foo            >> index/home/detail/foo
         *	..               >> index/home
         *	../foo           >> index/home/foo
         *
         * __Note:__<br>
         * If you are doing a goto to a sub- or parent-page and want to keep url-parameters of your current/parent page in tact, you should use
         *
         *	$.extend({}, Gaia.api.getDeeplink(), {foo: bar})
         *
         * to merge the current and new deeplink together and pass them as the deeplink parameter.
         *
         * @method goto
         * @param {string} branch
         * @param {HashMap} [deeplink]
         * @param {boolean} [replace=false]
         */
        GaiaImpl.prototype.goto = function (branch, deeplink, replace) {
            if (replace === void 0) { replace = false; }
            if (!branch)
                throw new Error("branch can not be empty");
            var branch = BranchTools.resolveBranch(branch, this.getCurrentBranch());
            GaiaHQ.getInstance().goto(branch, deeplink, null, null, replace);
        };
        /**
         * Opens a new page by providing the route.
         *
         * @method gotoRoute
         * @param {string} route
         */
        GaiaImpl.prototype.gotoRoute = function (route) {
            // add accidental missing starting /
            if (route.charAt(0) != '/') {
                route = route + '/';
            }
            // transform route into branch
            var branch = exports.router.resolvePage(route, true);
            if (branch) {
                GaiaHQ.getInstance().goto(branch[0].branch, branch[0].deeplink, null, null, false, route);
            }
            else {
                console.error('invalid route: ', route);
                GaiaHQ.getInstance().goto("index");
            }
        };
        /**
         * Navigates to a popup relative from the current base-branch.<br>
         * Popups are normal pages that are dynamically appended as subpages to all other pages.<br>
         * You navigate to popups using the branch-path of only the popup.<br>
         * So if you are on /index/home, and you want to open the about popup you do:
         *
         *	Gaia.api.gotoPopup('about');
         *
         * If you have a popup-wrapper named 'popup' the goto will be:
         *
         *	Gaia.api.gotoPopup('popup/about');
         *
         * Opening a new popup will automatically close other opened popups.
         *
         * Because opening a popup is almost always a sub-page (except when closing a current one),
         * it will automatically merge the passed deeplink over the current deeplink, keeping it in tact.
         *
         * @method gotoPopup
         * @param {string} popupId the 'branch-path' of the popup part of the branch, will be appended to the current branch
         * @param {HashMap} [deeplink]
         */
        GaiaImpl.prototype.gotoPopup = function (popupId, deeplink) {
            var branch = BranchTools.getPopupBranch(popupId, this.getCurrentBranch());
            // merge new deeplink over current one
            deeplink = $.extend({}, this.getDeeplink(), deeplink);
            this.goto(branch, deeplink);
        };
        /**
         * Closes the currently opened popup.
         * It will also automatically keep the current deeplink, alowing the parent page to keep working.
         *
         * @method closePopup
         */
        GaiaImpl.prototype.closePopup = function () {
            this.gotoPopup(null, this.getDeeplink());
        };
        /**
         * Returns the current branch.
         *
         * @method getCurrentBranch
         * @returns {string}
         */
        GaiaImpl.prototype.getCurrentBranch = function () {
            return SiteController.getCurrentBranch();
        };
        /**
         * Returns the current route.
         *
         * @method getCurrentRoute
         * @returns {string}
         */
        GaiaImpl.prototype.getCurrentRoute = function () {
            return SiteController.getCurrentRoute();
        };
        /**
         * Returns the current deeplink.
         *
         * The deeplink is an object filled with all the deeplink parameters.<br>
         * To get an individual parameter you can use {{#crossLink "gaia.api.GaiaImpl/getParam:method"}}{{/crossLink}}
         *
         * @method getDeeplink
         * @returns {HashMap}
         */
        GaiaImpl.prototype.getDeeplink = function () {
            return GaiaHistory.getInstance().getDeeplink();
        };
        /**
         * Returns a single deeplink param.
         *
         * @method getParam
         * @param {string} [key]
         * @returns {*}
         */
        GaiaImpl.prototype.getParam = function (key) {
            if (key === void 0) { key = null; }
            var dl = this.getDeeplink();
            if (dl == null || key == null) {
                return dl;
            }
            if (dl.hasOwnProperty(key)) {
                return dl[key];
            }
            else {
                return null;
            }
        };
        /**
         * Returns a query parameter, the part after the `?`
         *
         * @method getQueryParam
         * @param {string} key
         * @returns {string}
         */
        GaiaImpl.prototype.getQueryParam = function (key) {
            return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        };
        /**
         * Returns the valid branch from the input, stripping off all invalid parts of the link at the end.
         *
         * @method getValidBranch
         * @param {string} branch
         * @returns {string}
         */
        GaiaImpl.prototype.getValidBranch = function (branch) {
            return BranchTools.getValidBranch(branch);
        };
        /**
         * Returns the PageAsset from the given branch, giving access to data from the GaiaSitemap and the page Controller.
         *
         * @method getPage
         * @param {string} branch
         * @returns {IPageAsset}
         */
        GaiaImpl.prototype.getPage = function (branch) {
            return BranchTools.getPage(branch);
        };
        GaiaImpl.prototype.getDepthContainer = function (name) {
            return null;
        };
        /**
         * Goes back to the previous page, either by using the Browsers history, or checking internally.
         * @method back
         */
        GaiaImpl.prototype.back = function () {
            GaiaHistory.getInstance().back();
        };
        /**
         * Goes forward to the next page, either by using the Browsers history, or checking internally.
         * @method forward
         */
        GaiaImpl.prototype.forward = function () {
            GaiaHistory.getInstance().forward();
        };
        /**
         * Jumps x steps in the history, either by using the Browsers history, or checking internally.
         * @method jump
         */
        GaiaImpl.prototype.jump = function (steps) {
            GaiaHistory.getInstance().jump(steps);
        };
        // goto
        GaiaImpl.prototype.beforeGoto = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_GOTO, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterGoto = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_GOTO, target, hijack, onlyOnce);
        };
        // out
        GaiaImpl.prototype.beforeTransitionOut = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransitionOut = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION_OUT, target, hijack, onlyOnce);
        };
        // in
        GaiaImpl.prototype.beforeTransitionIn = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION_IN, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransitionIn = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION_IN, target, hijack, onlyOnce);
        };
        // trans
        GaiaImpl.prototype.beforeTransition = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.BEFORE_TRANSITION, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransition = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_TRANSITION, target, hijack, onlyOnce);
        };
        // complete
        GaiaImpl.prototype.afterComplete = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ.getInstance().addListener(gEvents.GaiaEvent.AFTER_COMPLETE, target, hijack, onlyOnce);
        };
        // goto
        GaiaImpl.prototype.removeBeforeGoto = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_GOTO, target);
        };
        GaiaImpl.prototype.removeAfterGoto = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_GOTO, target);
        };
        // out
        GaiaImpl.prototype.removeBeforeTransitionOut = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT, target);
        };
        GaiaImpl.prototype.removeAfterTransitionOut = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION_OUT, target);
        };
        // in
        GaiaImpl.prototype.removeBeforeTransitionIn = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION_IN, target);
        };
        GaiaImpl.prototype.removeAfterTransitionIn = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION_IN, target);
        };
        // trans
        GaiaImpl.prototype.removeBeforeTransition = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.BEFORE_TRANSITION, target);
        };
        GaiaImpl.prototype.removeAfterTransition = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_TRANSITION, target);
        };
        // complete
        GaiaImpl.prototype.removeAfterComplete = function (target) {
            GaiaHQ.getInstance().removeListener(gEvents.GaiaEvent.AFTER_COMPLETE, target);
        };
        GaiaImpl.prototype.addDeeplinkListener = function (target) {
            GaiaHistory.getInstance().addEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, target);
        };
        GaiaImpl.prototype.removeDeeplinkListener = function (target) {
            GaiaHistory.getInstance().removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, target);
        };
        /**
         * Check of Gaia is ready.
         *
         * @method isReady
         * @returns {boolean}
         */
        GaiaImpl.prototype.isReady = function () {
            return !!SiteController.getCurrentBranch();
        };
        return GaiaImpl;
    })();
    exports.GaiaImpl = GaiaImpl;
    /**
     * @namespace gaia.api
     * @class api
     */
    exports.api = new GaiaImpl();
    /**
     * @namespace gaia.api
     * @class history
     * @type GaiaHistory
     */
    exports.history = GaiaHistory.getInstance();
    /**
     * @namespace gaia.api
     * @class hq
     * @type GaiaImpl
     */
    exports.hq = GaiaHQ.getInstance();
    /**
     * @namespace gaia.api
     * @property router
     * @type gaia.router.GaiaRouter
     */
    exports.router = new GaiaRouter();
});
