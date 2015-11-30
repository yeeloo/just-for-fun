var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/EventDispatcher', 'lib/gaia/events/GaiaEvents', 'knockout'], function (require, exports, EventDispatcher, gEvents, ko) {
    /**
     * AbstractPageController
     *
     * @module Gaia
     * @namespace gaia.assets
     * @class AbstractPageController
     * @extends temple.events.EventDispatcher
     */
    var AbstractPageController = (function (_super) {
        __extends(AbstractPageController, _super);
        /**
         * Constructor
         *
         * @constructor
         */
        function AbstractPageController() {
            _super.call(this);
            /**
             * autotransitions rock, set to false if you want to do your own
             *
             * @property _autoTransition
             */
            this._autoTransition = true;
            /**
             * list of registered components, used for destruction
             *
             * @property _components
             * @protected
             */
            this._components = [];
            // list of Knockout subscriptions, used for destruction
            /**
             * list of registered components, used for destruction
             *
             * @property _subscriptions
             * @protected
             */
            this._subscriptions = [];
            // list of destructables, like Event handlers, used for destruction
            /**
             * list of registered components, used for destruction
             *
             * @property _destructibles
             * @protected
             */
            this._destructibles = [];
            /**
             * Debug flag
             *
             * @property _debug
             * @type boolean
             * @private
             */
            this._debug = false;
        }
        /**
         * save viewmodel reference, and add a refence back to this page on the viewModel
         *
         * @method setViewModel
         * @param {IViewModel} viewModel
         * @return {void}
         */
        AbstractPageController.prototype.setViewModel = function (viewModel) {
            this.viewModel = viewModel;
            this.viewModel.setController(this);
        };
        /**
         * set the template, so it can be used for KnockOut
         *
         * @method setTemplate
         * @param {string} template
         * @return {void}
         */
        AbstractPageController.prototype.setTemplate = function (template) {
            ko.templates[this.page.id] = template;
        };
        /**
         * always call super.init() when you override this method, or else we don't have a ViewController
         *
         * @method init
         * @return {void}
         */
        AbstractPageController.prototype.init = function () {
            var _this = this;
            // find container to inser this page in
            var container;
            var page = this.page;
            while (page.getParent() && !container) {
                // todo, add support for named containers: "[data-gaia-container=" + container + "]"
                var el = page.getParent().getContent().element;
                if (this.page.container) {
                    container = $('[data-gaia-container="' + this.page.container + '"]', el)[0];
                }
                else {
                    container = $('[data-gaia-container]', el)[0];
                }
                page = page.getParent();
            }
            // we need a container div for our page
            container = container || $('[data-gaia-container=' + this.page.container + ']')[0] || $('[data-gaia-container=main]')[0] || $('[data-gaia-container]')[0];
            var holder = document.createElement('div');
            // the template will be loded in this page via data-binding
            $(holder).attr('data-bind', "template: { name: '" + this.page.id + "' }");
            // we need this css-class for our styles
            $(holder).addClass('view view-' + this.page.id.replace(/\./g, '-'));
            // and add it
            container.appendChild(holder);
            // do the KnockOut magic
            ko.applyBindings(this.viewModel, holder);
            // save the refence
            this.element = holder;
            $(this.element).find('[data-gaia-container]').each(function (index, item) {
                if ($(item).attr('data-gaia-container') == '') {
                    $(item).attr('data-gaia-container', _this.page.id);
                }
            });
            // hide it for now, we will show it later in the TransitionManager
            this.element.style.visibility = 'hidden';
        };
        AbstractPageController.prototype.transition = function () {
            if (this._debug) {
                console.log('AbstractController::transition', this.page.id);
            }
            this.transitionComplete();
        };
        AbstractPageController.prototype.transitionIn = function () {
            if (this._debug) {
                console.log('AbstractController::transitionIn', this.page.id);
            }
            this.element.style.visibility = 'visible';
            this.transitionInComplete();
        };
        AbstractPageController.prototype.transitionOut = function () {
            if (this._debug) {
                console.log('AbstractController::transitionOut', this.page.id);
            }
            this.element.style.visibility = 'visible';
            this.transitionOutComplete();
        };
        AbstractPageController.prototype.transitionComplete = function () {
            if (this._debug) {
                console.log('AbstractController::transitionComplete', this.page.id);
            }
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_COMPLETE));
        };
        AbstractPageController.prototype.transitionInComplete = function () {
            if (this._debug) {
                console.log('AbstractController::transitionComplete', this.page.id);
            }
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_IN_COMPLETE));
        };
        AbstractPageController.prototype.transitionOutComplete = function () {
            if (this._debug) {
                console.log('AbstractController::transitionOutComplete', this.page.id);
            }
            this.dispatchEvent(new gEvents.PageEvent(gEvents.PageEvent.TRANSITION_OUT_COMPLETE));
        };
        AbstractPageController.prototype.onDeeplink = function (event) {
        };
        AbstractPageController.prototype.registerComponent = function (component) {
            this._components.push(component);
        };
        AbstractPageController.prototype.destruct = function () {
            $(this.element).off('.remove');
            if (this.viewModel) {
                if (typeof this.viewModel.destruct !== "undefined") {
                    this.viewModel.destruct();
                }
                this.viewModel = null;
            }
            this.page = null;
            $(this.element).remove();
            this.element = null;
            if (this._components) {
                while (this._components.length)
                    this._components.shift().destruct();
                this._components = null;
            }
            if (this._subscriptions) {
                while (this._subscriptions.length)
                    this._subscriptions.shift().dispose();
                this._subscriptions = null;
            }
            if (this._destructibles) {
                while (this._destructibles.length) {
                    this._destructibles.shift().destruct();
                }
                this._destructibles = null;
            }
            _super.prototype.destruct.call(this);
        };
        return AbstractPageController;
    })(EventDispatcher);
    return AbstractPageController;
});
