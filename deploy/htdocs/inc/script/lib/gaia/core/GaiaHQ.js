var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/gaia/api/Gaia', 'lib/gaia/core/BranchTools', 'lib/gaia/core/SiteModel', 'lib/gaia/flow/FlowManager', 'lib/gaia/events/GaiaEvents', 'lib/gaia/router/RouteResultItem', '../events/GotoEventItem', 'lib/temple/events/EventDispatcher', 'lib/temple/events/CommonEvent', 'lib/temple/events/BaseEvent'], function (require, exports, Gaia, BranchTools, SiteModel, FlowManager, gEvents, RouteResultItem, GaiaGotoEventItem, EventDispatcher, CommonEvent, BaseEvent) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class GaiaHQ
     * @extends temple.events.EventDispatcher
     */
    var GaiaHQ = (function (_super) {
        __extends(GaiaHQ, _super);
        function GaiaHQ() {
            _super.call(this);
            this.uniqueID = 0;
            this.listeners = [];
            this.listeners['beforeGoto'] = {};
            this.listeners['afterGoto'] = {};
            this.listeners['beforeTransitionOut'] = {};
            this.listeners['afterTransitionOut'] = {};
            this.listeners['beforePreload'] = {};
            this.listeners['afterPreload'] = {};
            this.listeners['beforeTransition'] = {};
            this.listeners['afterTransition'] = {};
            this.listeners['beforeTransitionIn'] = {};
            this.listeners['afterTransitionIn'] = {};
            this.listeners['afterComplete'] = {};
        }
        GaiaHQ.birth = function () {
        };
        /**
         *
         * @returns {GaiaHQ}
         */
        GaiaHQ.getInstance = function () {
            if (GaiaHQ._instance == null) {
                GaiaHQ._instance = new GaiaHQ();
            }
            return GaiaHQ._instance;
        };
        // Called by GaiaImpl
        GaiaHQ.prototype.addListener = function (eventName, target, hijack, onlyOnce) {
            if (this.listeners[eventName] != null) {
                var listener = this.generateListener(eventName, target);
                if (!listener.hijack && hijack) {
                    listener._onHijackCompleteDelegate = this.onHijackComplete.bind(this);
                    listener.addEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
                }
                else if (listener.hijack && !hijack) {
                    listener.removeEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
                }
                listener.hijack = hijack;
                listener.completed = !hijack;
                listener.onlyOnce = onlyOnce;
                this.addEventListener(eventName, listener.target);
                return (hijack) ? listener.completeCallback.bind(listener) : null;
            }
            else {
                console.log("GaiaHQ Error! addListener: " + eventName + " is not a valid event");
                return null;
            }
        };
        GaiaHQ.prototype.removeListener = function (eventName, target) {
            if (this.listeners[eventName] != undefined) {
                for (var id in this.listeners[eventName]) {
                    if (this.listeners[eventName].hasOwnProperty(id)) {
                        if (this.listeners[eventName][id].target == target) {
                            this.removeListenerByID(eventName, id);
                            break;
                        }
                    }
                }
            }
            else {
                console.log("GaiaHQ Error! removeListener: " + eventName + " is not a valid event");
            }
        };
        // This method is the beginning of the event chain
        GaiaHQ.prototype.goto = function (branch, deeplink, flow, queryString, replace, route) {
            if (deeplink === void 0) { deeplink = {}; }
            if (flow === void 0) { flow = null; }
            if (queryString === void 0) { queryString = null; }
            if (replace === void 0) { replace = false; }
            if (route === void 0) { route = null; }
            if (!branch) {
                branch = "index";
            }
            if (branch.substr(0, SiteModel.getIndexID().length) != SiteModel.getIndexID()) {
                branch = SiteModel.getIndexID() + "/" + branch;
            }
            branch = BranchTools.getValidBranch(branch);
            this.gotoEventObj = new GaiaGotoEventItem();
            this.gotoEventObj.routeResult = new RouteResultItem([{
                branch: branch,
                deeplink: deeplink
            }]);
            if (route) {
                var providedResult = Gaia.router.resolvePage(route);
                // if result of provided route doesn't match the goto object, the route has become invalid
                if (!providedResult.equals(this.gotoEventObj.routeResult)) {
                    route = null;
                }
            }
            this.gotoEventObj.routeResult.route = route;
            this.gotoEventObj.flow = flow;
            this.gotoEventObj.queryString = queryString;
            this.gotoEventObj.replace = replace;
            this.beforeGoto();
        };
        GaiaHQ.prototype.onGoto = function (event) {
            this.goto(event.routeResult[0].branch, event.routeResult[0].deeplink, null, null);
        };
        // EVENT HIJACKS
        // GOTO BEFORE / AFTER
        GaiaHQ.prototype.beforeGoto = function () {
            this.onEvent(gEvents.GaiaEvent.BEFORE_GOTO);
        };
        GaiaHQ.prototype.beforeGotoDone = function () {
            this.gotoEventObj.type = gEvents.GaiaEvent.GOTO;
            this.dispatchGaiaEvent();
        };
        GaiaHQ.prototype.afterGoto = function () {
            this.onEvent(gEvents.GaiaEvent.AFTER_GOTO);
        };
        GaiaHQ.prototype.afterGotoDone = function () {
            FlowManager.afterGoto();
        };
        // TRANSITION OUT BEFORE / AFTER
        GaiaHQ.prototype.beforeTransitionOut = function () {
            this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT);
        };
        GaiaHQ.prototype.beforeTransitionOutDone = function () {
            this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_OUT));
        };
        GaiaHQ.prototype.afterTransitionOut = function () {
            this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION_OUT);
        };
        GaiaHQ.prototype.afterTransitionOutDone = function () {
            FlowManager.afterTransitionOutDone();
        };
        // PRELOAD BEFORE / AFTER
        GaiaHQ.prototype.beforePreload = function () {
            this.onEvent(gEvents.GaiaEvent.BEFORE_PRELOAD);
        };
        GaiaHQ.prototype.beforePreloadDone = function () {
            this.dispatchEvent(new BaseEvent(GaiaHQ.PRELOAD));
        };
        GaiaHQ.prototype.afterPreload = function () {
            this.onEvent(gEvents.GaiaEvent.AFTER_PRELOAD);
        };
        GaiaHQ.prototype.afterPreloadDone = function () {
            FlowManager.afterPreloadDone();
        };
        // TRANSITION IN BEFORE / AFTER
        GaiaHQ.prototype.beforeTransition = function () {
            this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION);
        };
        GaiaHQ.prototype.beforeTransitionDone = function () {
            this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION));
        };
        GaiaHQ.prototype.afterTransition = function () {
            this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION);
        };
        GaiaHQ.prototype.afterTransitionDone = function () {
            FlowManager.afterTransitionDone();
        };
        // TRANSITION IN BEFORE / AFTER
        GaiaHQ.prototype.beforeTransitionIn = function () {
            this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION_IN);
        };
        GaiaHQ.prototype.beforeTransitionInDone = function () {
            this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_IN));
        };
        GaiaHQ.prototype.afterTransitionIn = function () {
            this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION_IN);
        };
        GaiaHQ.prototype.afterTransitionInDone = function () {
            FlowManager.afterTransitionInDone();
        };
        // AFTER COMPLETE
        GaiaHQ.prototype.afterComplete = function () {
            this.dispatchEvent(new BaseEvent(GaiaHQ.COMPLETE));
            this.onEvent(gEvents.GaiaEvent.AFTER_COMPLETE);
        };
        GaiaHQ.prototype.afterCompleteDone = function () {
            // we're done
        };
        // WHEN GAIA EVENTS OCCUR THEY ARE ROUTED THROUGH HERE FOR HIJACKING
        GaiaHQ.prototype.onEvent = function (eventName) {
            var eventHasListeners = false;
            var eventHasHijackers = false;
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id] != null) {
                        eventHasListeners = true;
                        var listener = this.listeners[eventName][id];
                        if (listener.onlyOnce) {
                            listener.dispatched = true;
                        }
                        if (listener.hijack) {
                            eventHasHijackers = true;
                        }
                    }
                }
            }
            this.gotoEventObj.type = eventName;
            if (eventHasListeners) {
                this.dispatchGaiaEvent();
            }
            if (!eventHasHijackers) {
                this[eventName + "Done"]();
            }
            this.removeOnlyOnceListeners(eventName);
        };
        // GENERATES AN EVENT HIJACKER
        GaiaHQ.prototype.generateListener = function (eventName, target) {
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id].target == target) {
                        this.removeEventListener(eventName, target);
                        return this.listeners[eventName][id];
                    }
                }
            }
            // new listener
            var listener = new GaiaHQListener();
            listener.event = eventName;
            listener.target = target;
            this.listeners[eventName][String(++this.uniqueID)] = listener;
            return listener;
        };
        // REMOVES EVENT LISTENERS BY THEIR UNIQUE ID
        GaiaHQ.prototype.removeListenerByID = function (eventName, id) {
            this.listeners[eventName][id].removeEventListener(CommonEvent.COMPLETE, this.onHijackComplete);
            this.removeEventListener(eventName, this.listeners[eventName][id].target);
            delete this.listeners[eventName][id];
        };
        // REMOVES EVENT LISTENERS THAT ONLY LISTEN ONCE
        GaiaHQ.prototype.removeOnlyOnceListeners = function (eventName) {
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    var listener = this.listeners[eventName][id];
                    if (listener.onlyOnce && listener.dispatched && !listener.hijack) {
                        this.removeListenerByID(eventName, id);
                    }
                }
            }
        };
        // RESET COMPLETED HIJACKERS AFTER ALL HIJACKERS ARE COMPLETE AND REMOVE ONLY ONCE HIJACKERS
        GaiaHQ.prototype.resetEventHijackers = function (eventName) {
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (this.listeners[eventName][id].hijack) {
                        if (!this.listeners[eventName][id].onlyOnce) {
                            this.listeners[eventName][id].completed = false;
                        }
                        else {
                            this.removeListenerByID(eventName, id);
                        }
                    }
                }
            }
        };
        // EVENT RECEIVED FROM EVENT HIJACKERS WHEN WAIT FOR COMPLETE CALLBACK IS CALLED
        GaiaHQ.prototype.onHijackComplete = function (event) {
            var allDone = true;
            var eventName = event.target.event;
            for (var id in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(id)) {
                    if (!this.listeners[eventName][id].completed) {
                        allDone = false;
                        break;
                    }
                }
            }
            if (allDone) {
                this.resetEventHijackers(eventName);
                this[eventName + "Done"]();
            }
        };
        GaiaHQ.prototype.dispatchGaiaEvent = function () {
            var evt = new gEvents.GaiaEvent(this.gotoEventObj.type, this.gotoEventObj.routeResult, this.gotoEventObj.external, this.gotoEventObj.src, this.gotoEventObj.flow, this.gotoEventObj.window, null, this.gotoEventObj.replace);
            this.dispatchEvent(evt);
        };
        GaiaHQ.TRANSITION_OUT = "transitionOut";
        GaiaHQ.TRANSITION_IN = "transitionIn";
        GaiaHQ.TRANSITION = "transition";
        GaiaHQ.PRELOAD = "preload";
        GaiaHQ.COMPLETE = "complete";
        return GaiaHQ;
    })(EventDispatcher);
    var GaiaHQListener = (function (_super) {
        __extends(GaiaHQListener, _super);
        function GaiaHQListener() {
            _super.call(this);
        }
        GaiaHQListener.prototype.completeCallback = function (destroy) {
            if (destroy === void 0) { destroy = false; }
            this.completed = true;
            if (destroy) {
                this.onlyOnce = true;
            }
            this.dispatchEvent(new CommonEvent(CommonEvent.COMPLETE));
        };
        return GaiaHQListener;
    })(EventDispatcher);
    return GaiaHQ;
});
