var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/gaia/api/Gaia', 'lib/gaia/events/GaiaEvents', 'lib/temple/events/EventDispatcher', 'knockout'], function (require, exports, Gaia, gEvents, EventDispatcher, ko) {
    /**
     * PageAsset
     *
     * @module Gaia
     * @namespace gaia.assets
     * @class PageAsset
     * @extend temple.events.EventDispatcher
     */
    var PageAsset = (function (_super) {
        __extends(PageAsset, _super);
        function PageAsset(node) {
            _super.call(this);
            this._debug = false;
            this._node = node;
            // net data by node
            this.id = node.id;
            var defaultFile = this.id + '/' + this.id.charAt(0).toUpperCase() + this.id.replace(/\-[a-z0-9]/g, function (x) {
                return x.charAt(1).toUpperCase();
            }).substr(1);
            var folder = (this._node.folder || '');
            this.title = node.title || node.id;
            this.data = node.data || {};
            this.container = node.container;
            this.partials = node.partials || {};
            // get paths
            this.template = this.getFileValue(node.template, PageAsset.templatePath, PageAsset.templateMobilePath, folder, 'default.html', this.id, false, '.html');
            this.controllerName = this.getFileValue(node.controller, PageAsset.controllerPath, PageAsset.controllerMobilePath, folder, 'CustomAbstractController', defaultFile + 'Controller');
            this.viewModelName = this.getFileValue(node.viewModel, PageAsset.viewModelPath, PageAsset.viewModelMobilePath, folder, 'DefaultViewModel', defaultFile + 'ViewModel');
            // default landing = false.
            if (typeof node.landing == 'undefined') {
                this.landing = false;
            }
            else {
                this.landing = node.landing;
            }
            this.pages = {};
            this.assets = {};
        }
        PageAsset.prototype.getFileValue = function (value, path, pathMobile, folder, defaultFile, autoFile, isMobileValue, fileExtension) {
            //		console.log('getFileValue: ', arguments);
            if (isMobileValue === void 0) { isMobileValue = false; }
            if (fileExtension === void 0) { fileExtension = ''; }
            if (typeof value === 'object') {
                return this.getFileValue((isMobile ? value.mobile : value.app), path, pathMobile, folder, defaultFile, autoFile, isMobile, fileExtension);
            }
            else if (value == 'mobile') {
                return (isMobile ? pathMobile : path) + folder + autoFile + fileExtension;
            }
            else if (typeof value === 'undefined') {
                return (isMobileValue ? pathMobile : path) + folder + autoFile + fileExtension;
            }
            else if (value != 'default') {
                return (isMobileValue ? pathMobile : path) + folder + value;
            }
            else if (value == 'default') {
                return (isMobileValue ? pathMobile : path) + defaultFile;
            }
            return '';
        };
        PageAsset.prototype.init = function () {
            this._onGaiaHistoryDelegate = this.onDeeplink.bind(this);
            this._onTransitionCompleteDelegate = this.onTransitionComplete.bind(this);
            this._onTransitionInCompleteDelegate = this.onTransitionInComplete.bind(this);
            this._onTransitionOutCompleteDelegate = this.onTransitionOutComplete.bind(this);
        };
        PageAsset.prototype.getBranch = function () {
            if (this._parent != null) {
                return this._parent.getBranch() + "/" + this.id;
            }
            return this.id;
        };
        PageAsset.prototype.getContent = function () {
            return this._controller;
        };
        PageAsset.prototype.getData = function (key, inherit) {
            if (inherit === void 0) { inherit = false; }
            // return complete object
            if (!key) {
                if (inherit && this.getParent()) {
                    return $.extend({}, this.getParent().getData(key, inherit), this.data);
                }
                else {
                    return this.data;
                }
            }
            // if no data, check possible with parent (else return null)
            if (key && !this.data) {
                if (inherit && this.getParent()) {
                    return this.getParent().getData(key, inherit);
                }
                return null;
            }
            // return key
            if (key in this.data)
                return this.data[key];
            // return parent key
            if (inherit && this.getParent()) {
                return this.getParent().getData(key, inherit);
            }
            return null;
        };
        PageAsset.prototype.setParent = function (value) {
            if (this._parent == null) {
                this._parent = value;
            }
        };
        PageAsset.prototype.getParent = function () {
            return this._parent;
        };
        PageAsset.prototype.preload = function () {
            var _this = this;
            this.active = true;
            var fileList = [
                this.viewModelName,
                this.controllerName
            ];
            if (!ko.templates.hasOwnProperty(this.id) && !document.getElementById(this.id)) {
                fileList.push('text!' + this.template);
            }
            var partialIds = [];
            var partials = this.partials[isMobile ? 'mobile' : 'app'] || [];
            for (var i = 0; i < partials.length; i++) {
                var partial = partials[i];
                var partialId = partial.split('/').pop().split('.').shift();
                if (!ko.templates[partialId] && !document.getElementById(partialId)) {
                    fileList.push('text!' + (this._node.template == 'mobile' && isMobile ? PageAsset.templateMobilePath : PageAsset.templatePath) + partial);
                    partialIds.push(partialId);
                }
            }
            require(fileList, function (viewModel, controller, template) {
                var classRef;
                // store partials
                var start = arguments['length'] - partialIds.length;
                for (var i = start; i < arguments['length']; i++) {
                    ko.templates[partialIds[i - start]] = arguments[i];
                }
                //			classRef = this.controllerName.split('/').pop();
                //			controller = controller[classRef];
                //
                //			classRef = this.viewModelName.split('/').pop();
                //			viewModel = viewModel[classRef];
                _this._controller = (new (controller)());
                _this.onComplete();
                if (template) {
                    _this._controller.setTemplate(template);
                }
                _this._controller.setViewModel((new (viewModel)()));
                _this.dispatchEvent(new gEvents.AssetEvent(gEvents.AssetEvent.ASSET_COMPLETE, _this));
            });
        };
        PageAsset.prototype.initPage = function () {
            if (!this.isTransitionedIn) {
                this._controller.init();
            }
        };
        PageAsset.prototype.transition = function () {
            if (this._debug) {
                console.log('PageAsset::transition', this.id);
            }
            this._controller.transition();
        };
        PageAsset.prototype.transitionIn = function () {
            if (this._debug) {
                console.log('PageAsset::transitionIn', this.id);
            }
            if (!this.isTransitionedIn) {
                //initAssets();
                this._controller.transitionIn();
            }
            else {
                this.onTransitionInComplete();
            }
        };
        PageAsset.prototype.transitionOut = function () {
            if (this._debug) {
                console.log('PageAsset::transitionOut', this.id);
            }
            Gaia.history.removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);
            if (this.isTransitionedIn) {
                this._controller.transitionOut();
            }
            else {
                this.onTransitionOutComplete();
            }
        };
        // EVENT LISTENERS
        PageAsset.prototype.onTransitionComplete = function (event) {
            if (event === void 0) { event = null; }
            if (this._debug) {
                console.log('PageAsset::onTransitionComplete', this.id);
            }
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_COMPLETE));
        };
        PageAsset.prototype.onTransitionInComplete = function (event) {
            if (event === void 0) { event = null; }
            if (this._debug) {
                console.log('PageAsset::onTransitionInComplete', this.id);
            }
            this.isTransitionedIn = true;
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_IN_COMPLETE));
        };
        PageAsset.prototype.onTransitionOutComplete = function (event) {
            if (event === void 0) { event = null; }
            if (this._debug) {
                console.log('PageAsset::onTransitionOutComplete', this.id);
            }
            this.destroy();
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_OUT_COMPLETE));
        };
        PageAsset.prototype.onComplete = function () {
            this.decorate();
            Gaia.history.addEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);
            this.isTransitionedIn = false;
            //super.onComplete(event);
            //_loader.content.visible = true;
        };
        // GaiaHistory sends deeplink events to active pages
        PageAsset.prototype.onDeeplink = function (event) {
            this._controller.onDeeplink(event);
        };
        PageAsset.prototype.decorate = function () {
            this._controller.addEventListener(gEvents.PageEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            this._controller.addEventListener(gEvents.PageEvent.TRANSITION_IN_COMPLETE, this._onTransitionInCompleteDelegate);
            this._controller.addEventListener(gEvents.PageEvent.TRANSITION_OUT_COMPLETE, this._onTransitionOutCompleteDelegate);
            this._controller.page = this;
        };
        PageAsset.prototype.destroy = function () {
            this.isTransitionedIn = false;
            if (this._controller) {
                this._controller.destruct();
                this._controller = null;
            }
            Gaia.history.removeEventListener(gEvents.GaiaHistoryEvent.DEEPLINK, this._onGaiaHistoryDelegate);
            this.active = false;
        };
        PageAsset.viewModelPath = 'app/page/';
        PageAsset.controllerPath = 'app/page/';
        PageAsset.templatePath = 'app/../../template/'; // relative to this file
        PageAsset.viewModelMobilePath = 'mobile/page/';
        PageAsset.controllerMobilePath = 'mobile/page/';
        PageAsset.templateMobilePath = 'app/../../template/mobile/'; // relative to this file
        return PageAsset;
    })(EventDispatcher);
    return PageAsset;
});
