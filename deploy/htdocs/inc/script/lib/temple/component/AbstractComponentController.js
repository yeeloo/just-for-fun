var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/events/EventDispatcher'], function (require, exports, EventDispatcher) {
    /**
     * @namespace temple.component
     * @class AbstractComponentController
     * @extend temple.events.EventDispatcher
     */
    var AbstractComponentController = (function (_super) {
        __extends(AbstractComponentController, _super);
        /**
         * Intro
         * ==========
         * Components are a clean way of organizing your UI elements/widgets into self-contained, reusable chunks. Components have
         * their own controller, viewmodel and template. They are loaded asynchronously, receive options, are evented and
         * can even be nested. Multiple of the same component may exist on the same page. Components are called using
         * knockout bindings from your view's template.
         *
         * Creating a component
         * ====================
         * It is advised to use the create-component Grunt task to automatically create a component. Open a console in the
         * tools/build directory of your project and run:
         *
         *     grunt component --name my-component
         *
         * where `my-component` is the name of your component. The task will automatically create a controller, viewmodel,
         * template and options interface for you. Make sure the given name is hyphen-seperated (not camelcase, or
         * underscored). It will create a `MyComponentController` class, `my-component.html` template and so forth.
         *
         * Using a component
         * =================
         * You can initialize a component by adding the following in your view:
         *
         *     <!--ko component: 'my-component'--><!--/ko-->
         *
         * Components can also be passed options.
         *
         *     <!--ko component: {
         *         component: 'my-component',
         *         options: {
         *             foo: 'bar',
         *             bar: 'baz'
         *         }
         *     --><!--/ko-->
         *
         * Because components are loaded asynchronously, you should never expect it to be loaded when your parent page's
         * `init()` function is called. Because of this, you can pass a function to the component which is called when the
         * component is ready.
         *
         *     <!--ko component: {
         *         component: 'my-component',
         *         callback: controller.myComponentReady.bind(controller)
         *     --><!--/ko-->
         *
         * The function `myComponentReady` will be called with the component's controller as the first argument.
         *
         *     myComponentReady(component:MyComponentController) {
         *         // add event listeners to the component
         *         // or call some methods on the component
         *         // etc
         *     }
         *
         * Developing components
         * =====================
         * Components are structured the same way pages are. They have a controller, viewmodel and template. Additionally,
         * a component also has an options (`MyComponentOptions`) interface, in which you declare the options that may be
         * passed to your component (for TypeScript's type checker).
         *
         * A SCSS file is also automatically created for styling your component. It can be found in `style/component`.
         *
         * ## Wrapping a component around arbitrary HTML
         * In some cases it will be necessary to create a component that wraps itself around some arbitrary HTML which the
         * component can transform:
         *
         *     <!--ko component: 'my-component'-->
         *         <p>Hello world!</p>
         *     <!--/ko-->
         *
         * A good example is a custom scrolling wrapper, where the component should handle the
         * scrollbar, touch support (e.g. Greensock's Draggable) and so forth. For this reason, components may manage the
         * application of the template themselves to let the author of the component choose what to do.
         *
         * AbstractComponentController has a method called `setTemplate`. The component's template is passed as a string. By
         * default `setTemplate` clears the inner HTML of the virtual element, applies the template and binds the viewmodel
         * to the template. You can change how this method behaves by overwriting it in your `MyComponentController`.
         *
         * Footnotes
         * =========
         * * Never call AbstractComponentController/ViewModel manually! A component should extend these classes.
         * * Components are loaded asynchronously: do NOT expect a component to be loaded when your page's `init()` is called
         *   always use the callback to run code when the component is available in the view.
         * * As always, make sure you clean up your variables in the `destruct` method.
         *
         * @class AbstractComponentController
         * @constructor
         * @param {HTMLElement} element
         * @param {any} options
         */
        function AbstractComponentController(element, options) {
            _super.call(this);
            // list of registered components, used for destructing
            this._components = [];
            this._subscriptions = [];
            this.element = element;
            if (typeof options !== 'undefined') {
                this.options = options;
            }
        }
        /**
         * Subsribes an observable to another observable. Useful for binding observables passed to a component through
         * options to an observable in the component's viewmodel.
         *
         * @method applyThreeWayBinding
         * @param {KnockoutObservable<any>} source
         * @param {KnockoutObservable<any>} target
         */
        AbstractComponentController.prototype.applyThreeWayBinding = function (source, target) {
            if (ko.isObservable(source)) {
                this._subscriptions.push(source.subscribe(target));
            }
            target(ko.unwrap(source));
        };
        /**
         * Applies the template to the container DOM
         * Override this in your controller if you want to use the HTML provided inside the container
         *
         * @method setTemplate
         * @param {string} template
         */
        AbstractComponentController.prototype.setTemplate = function (template) {
            if (template == void 0) {
                return;
            }
            ko.cleanNode(this.element);
            ko.virtualElements.emptyNode(this.element);
            this.template = template;
            if ($(template).filter(':not(text)').length > 1) {
                console.error('Component template has multiple root elements. Knockout bindings will only be applied to the first root element!');
            }
            ko.virtualElements.setDomNodeChildren(this.element, ko.utils.parseHtmlFragment(template));
            ko.applyBindings(this.viewModel, ko.virtualElements.firstChild(this.element));
            this.element = ko.virtualElements.firstChild(this.element);
        };
        /**
         * @method setViewModel
         * @param {IComponentViewModel} viewModel
         */
        AbstractComponentController.prototype.setViewModel = function (viewModel) {
            this.viewModel = viewModel;
            this.viewModel.setController(this);
        };
        AbstractComponentController.prototype.init = function () {
        };
        /**
         * Register component
         *
         * @method registerComponent
         * @param {AbstractComponentController} controller
         */
        AbstractComponentController.prototype.registerComponent = function (controller) {
            this._components.push(controller);
        };
        /**
         * @inheritDoc
         */
        AbstractComponentController.prototype.destruct = function () {
            if (!this.isDestructed()) {
                ko.cleanNode(this.element);
                if (this.viewModel) {
                    this.viewModel.destruct();
                    this.viewModel = null;
                }
                this.element = null;
                this.options = null;
                this.template = null;
                this.eventNamespace = null;
                if (this._subscriptions) {
                    for (var i = 0; i < this._subscriptions.length; i++) {
                        this._subscriptions[i].dispose();
                    }
                    this._subscriptions = null;
                }
            }
            _super.prototype.destruct.call(this);
        };
        return AbstractComponentController;
    })(EventDispatcher);
    return AbstractComponentController;
});
