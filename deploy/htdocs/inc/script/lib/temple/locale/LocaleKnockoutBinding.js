define(["require", "exports", './element/KOElementManager', './element/ImageElementManager', './element/BackgroundImageElementManager', './formatter/LowerCaseFormatter', './formatter/UpperCaseFormatter', './formatter/MaxCharsFormatter', './formatter/ReplaceFormatter', './formatter/PluralFormatter', './formatter/CustomFormatter', 'knockout'], function (require, exports, KOElementManager, ImageElementManager, BackgroundImageElementManager, LowerCaseFormatter, UpperCaseFormatter, MaxCharsFormatter, ReplaceFormatter, PluralFormatter, CustomFormatter, ko) {
    /**
     * Regexp to fetch translation-id's and their value
     *
     *     <([^\s]+).*data-bind=".*localizedText:\s*(["']?)([a-zA-Z0-9_-]+)\2\s*".*>(.*)</\1>
     *
     * group 3 or group 5 = ID
     * group 6 = original value
     *
     *     <([^\s]+)[^>]*data-bind="[^"]*localizedText:\s*(?:(["']?)([a-zA-Z0-9_-]+)\2|[^"]*id:\s*(["']?)([a-zA-Z0-9_-]+)\4)[^"]*"[^>]*>(.*?)</\1>
     *
     *     <([^\s]+)[^>]*
     *         data-bind="[^"]*
     *             localizedText:\s*(?:
     *                 (["']?)([a-zA-Z0-9_-]+)\2 |
     *                 [^"]*id:\s*(["']?)([a-zA-Z0-9_-]+)\4
     *             )
     *         [^"]*"
     *     [^>]*>(.*?)</\1>
     *
     * @module Temple
     * @namespace temple.locale
     * @class LocaleKnockoutBinding
     */
    var LocaleKnockoutBinding = (function () {
        function LocaleKnockoutBinding() {
            ko.bindingHandlers.localizedText = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    this._formatterString = '';
                    // sets up the config object
                    this.getConfig = function (va) {
                        var config = ko.utils.unwrapObservable(va());
                        if (typeof config === 'string') {
                            config = [
                                {
                                    'id': config
                                }
                            ];
                        }
                        if (!(config instanceof Array)) {
                            config = [
                                config
                            ];
                        }
                        return config;
                    };
                    // gets and checks the HTML propertiy
                    this.getAttr = function (el, config) {
                        var attr = 'text';
                        if ((ko.utils.unwrapObservable(config.html) == true || ko.utils.unwrapObservable(config.attr) == 'html') && el.nodeType == 8) {
                            //						console.error('html is not supported in virtual elements: ', el);
                            return 'text';
                        }
                        if (config.hasOwnProperty('attr')) {
                            attr = ko.utils.unwrapObservable(config.attr);
                        }
                        else if (config.hasOwnProperty('html')) {
                            attr = ko.utils.unwrapObservable(config.html);
                        }
                        if (typeof attr == 'boolean') {
                            attr = attr ? 'html' : 'text';
                        }
                        return attr;
                    };
                    // constructs formatters based on config
                    this.getFormatters = function (config) {
                        if (typeof config.formatters !== 'undefined') {
                            var formatters = [];
                            for (var i = 0; i < config.formatters.length; i++) {
                                var formatter = config.formatters[i];
                                var options = ko.utils.unwrapObservable(formatter.options);
                                if (typeof options == 'object') {
                                    options = ko.toJS(formatter.options);
                                }
                                switch (formatter.name) {
                                    case 'lowercase':
                                        {
                                            formatters.push(new LowerCaseFormatter());
                                            break;
                                        }
                                    case 'uppercase':
                                        {
                                            formatters.push(new UpperCaseFormatter());
                                            break;
                                        }
                                    case 'maxchars':
                                        {
                                            formatters.push(new MaxCharsFormatter(options.maxChars, options.readMoreChars, options.splitOnWord));
                                            break;
                                        }
                                    case 'replace':
                                        {
                                            formatters.push(new ReplaceFormatter(options.replacements));
                                            break;
                                        }
                                    case 'plural':
                                        {
                                            formatters.push(new PluralFormatter(options.replacements));
                                            break;
                                        }
                                    case 'custom':
                                        {
                                            formatters.push(new CustomFormatter(options.func));
                                            break;
                                        }
                                }
                            }
                            return formatters;
                        }
                        else {
                            return [];
                        }
                    };
                    var configs = this.getConfig(valueAccessor);
                    for (var i = 0; i < configs.length; i++) {
                        var config = configs[i];
                        var attr = this.getAttr(element, config);
                        KOElementManager.getInstance().add(element, ko.utils.unwrapObservable(config.id), attr, []);
                    }
                    return { controlsDescendantBindings: true };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var configs = this.getConfig(valueAccessor);
                    for (var i = 0; i < configs.length; i++) {
                        var config = configs[i];
                        var attr = this.getAttr(element, config);
                        var data = KOElementManager.getInstance().getDataForElement(element, attr);
                        if (data) {
                            data.id = ko.utils.unwrapObservable(config.id);
                            data.attr = attr;
                            data.formatters = this.getFormatters(config);
                            KOElementManager.getInstance().updateElement(data);
                        }
                    }
                }
            };
            ko.virtualElements.allowedBindings['localizedText'] = true;
            ko.bindingHandlers.localizedImage = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    if (typeof value === 'string') {
                        ImageElementManager.getInstance().add(element, value);
                    }
                    else {
                        ImageElementManager.getInstance().add(element);
                    }
                    return { controlsDescendantBindings: true };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var data = ImageElementManager.getInstance().getDataForElement(element);
                    ImageElementManager.getInstance().updateElement(data);
                }
            };
            ko.bindingHandlers.localizedBgImage = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    if (typeof value === 'string') {
                        BackgroundImageElementManager.getInstance().add(element, value);
                    }
                    else {
                        BackgroundImageElementManager.getInstance().add(element);
                    }
                    return { controlsDescendantBindings: true };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var data = BackgroundImageElementManager.getInstance().getDataForElement(element);
                    BackgroundImageElementManager.getInstance().updateElement(data);
                }
            };
        }
        return LocaleKnockoutBinding;
    })();
    return LocaleKnockoutBinding;
});
