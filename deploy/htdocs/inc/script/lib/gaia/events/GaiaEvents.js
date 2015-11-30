var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/BaseEvent'], function (require, exports, BaseEvent) {
    var BranchLoaderEvent = (function (_super) {
        __extends(BranchLoaderEvent, _super);
        function BranchLoaderEvent(type, asset) {
            if (asset === void 0) { asset = null; }
            _super.call(this, type);
            this.asset = asset;
        }
        BranchLoaderEvent.LOAD_PAGE = "BranchLoaderEvent.loadPage";
        BranchLoaderEvent.LOAD_ASSET = "BranchLoaderEvent.loadAsset";
        BranchLoaderEvent.START = "BranchLoaderEvent.start";
        BranchLoaderEvent.COMPLETE = "BranchLoaderEvent.complete";
        return BranchLoaderEvent;
    })(BaseEvent);
    exports.BranchLoaderEvent = BranchLoaderEvent;
    var PageEvent = (function (_super) {
        __extends(PageEvent, _super);
        function PageEvent(type) {
            _super.call(this, type);
        }
        PageEvent.TRANSITION_OUT = "PageEvent.transitionOut";
        PageEvent.TRANSITION_OUT_COMPLETE = "PageEvent.transitionOutComplete";
        PageEvent.TRANSITION_IN = "PageEvent.transitionIn";
        PageEvent.TRANSITION_IN_COMPLETE = "PageEvent.transitionInComplete";
        PageEvent.TRANSITION = "PageEvent.transition";
        PageEvent.TRANSITION_COMPLETE = "PageEvent.transitionComplete";
        PageEvent.LEVEL_CHANGE = "PageEvent.levelChange";
        return PageEvent;
    })(BaseEvent);
    exports.PageEvent = PageEvent;
    var AssetEvent = (function (_super) {
        __extends(AssetEvent, _super);
        function AssetEvent(type, asset, loaded, total, perc, bytes) {
            if (asset === void 0) { asset = null; }
            if (loaded === void 0) { loaded = 0; }
            if (total === void 0) { total = 0; }
            if (perc === void 0) { perc = 0; }
            if (bytes === void 0) { bytes = false; }
            _super.call(this, type);
            this.asset = asset;
            this.loaded = loaded;
            this.total = total;
            this.perc = perc;
            this.bytes = bytes;
        }
        AssetEvent.ASSET_COMPLETE = "assetComplete";
        AssetEvent.ASSET_PROGRESS = "assetProgress";
        AssetEvent.ASSET_ERROR = "assetError";
        return AssetEvent;
    })(BaseEvent);
    exports.AssetEvent = AssetEvent;
    var GaiaEvent = (function (_super) {
        __extends(GaiaEvent, _super);
        function GaiaEvent(type, routeResult, external, src, flow, window, queryString, replace) {
            if (flow === void 0) { flow = null; }
            if (window === void 0) { window = "_self"; }
            if (queryString === void 0) { queryString = null; }
            if (replace === void 0) { replace = false; }
            _super.call(this, type);
            this.routeResult = routeResult;
            this.external = external;
            this.src = src;
            this.flow = flow;
            this.window = window;
            this.queryString = queryString;
            this.replace = replace;
        }
        GaiaEvent.GOTO = "goto";
        GaiaEvent.BEFORE_GOTO = "beforeGoto";
        GaiaEvent.AFTER_GOTO = "afterGoto";
        GaiaEvent.BEFORE_TRANSITION_OUT = "beforeTransitionOut";
        GaiaEvent.AFTER_TRANSITION_OUT = "afterTransitionOut";
        GaiaEvent.BEFORE_PRELOAD = "beforePreload";
        GaiaEvent.AFTER_PRELOAD = "afterPreload";
        GaiaEvent.BEFORE_TRANSITION = "beforeTransition";
        GaiaEvent.AFTER_TRANSITION = "afterTransition";
        GaiaEvent.BEFORE_TRANSITION_IN = "beforeTransitionIn";
        GaiaEvent.AFTER_TRANSITION_IN = "afterTransitionIn";
        GaiaEvent.AFTER_COMPLETE = "afterComplete";
        return GaiaEvent;
    })(BaseEvent);
    exports.GaiaEvent = GaiaEvent;
    var GaiaHistoryEvent = (function (_super) {
        __extends(GaiaHistoryEvent, _super);
        function GaiaHistoryEvent(type, routeResult) {
            _super.call(this, type);
            this.routeResult = routeResult;
        }
        GaiaHistoryEvent.DEEPLINK = "deeplink";
        GaiaHistoryEvent.GOTO = "goto";
        return GaiaHistoryEvent;
    })(BaseEvent);
    exports.GaiaHistoryEvent = GaiaHistoryEvent;
});
