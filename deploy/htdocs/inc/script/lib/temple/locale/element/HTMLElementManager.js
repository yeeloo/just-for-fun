var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractElementManager', './data/HTMLElementData'], function (require, exports, AbstractElementManager, HTMLElementData) {
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @extend temple.locale.element.AbstractElementManager
     * @class HTMLElementManager
     */
    var HTMLElementManager = (function (_super) {
        __extends(HTMLElementManager, _super);
        function HTMLElementManager() {
            _super.call(this);
        }
        /**
         * @public
         * @static
         * @method getInstance
         * @returns {HTMLElementManager}
         */
        HTMLElementManager.getInstance = function () {
            if (typeof HTMLElementManager._instance === 'undefined') {
                HTMLElementManager._instance = new HTMLElementManager();
            }
            return HTMLElementManager._instance;
        };
        /**
         * @public
         * @method add
         * @param {HTMLElement} element
         * @param {string} id
         * @param {any} attr
         * @param {ITextFormatters[]} formatters
         */
        HTMLElementManager.prototype.add = function (element, id, attr, formatters) {
            if (attr === void 0) { attr = 'text'; }
            if (formatters === void 0) { formatters = []; }
            if (!element || typeof element === 'undefined') {
                console.log('no element ', element);
                return;
            }
            if (typeof attr === 'boolean') {
                attr = attr ? 'html' : 'text';
            }
            _super.prototype.addElement.call(this, new HTMLElementData(element, id, attr, formatters));
        };
        /**
         * @public
         * @method getDataForElement
         * @param {any} element
         * @param {string} attr
         * @returns {HTMLElementData}
         */
        HTMLElementManager.prototype.getDataForElement = function (element, attr) {
            if (attr === void 0) { attr = null; }
            if (!attr) {
                return _super.prototype.getDataForElement.call(this, element);
            }
            for (var i = 0; i < this._elements.length; i++) {
                if (this._elements[i].element == element && this._elements[i].attr == attr) {
                    return this._elements[i];
                }
            }
            // fallback
            return _super.prototype.getDataForElement.call(this, element);
        };
        /**
         * @public
         * @method updateElement
         * @param {HTMLElementData} data
         */
        HTMLElementManager.prototype.updateElement = function (data) {
            var text = this._localeManager.getString(data.id);
            for (var i = 0; i < data.formatters.length; i++) {
                text = data.formatters[i].format(text);
            }
            this.setText(data, text);
        };
        /**
         * @public
         * @method setText
         * @param {any} data
         * @param {string} text
         */
        HTMLElementManager.prototype.setText = function (data, text) {
            switch (data.attr) {
                case 'text':
                    {
                        $(data.element).text(text);
                        break;
                    }
                case 'html':
                    {
                        $(data.element).html(text);
                        break;
                    }
                default:
                    {
                        $(data.element).attr(data.attr, text);
                        break;
                    }
            }
        };
        return HTMLElementManager;
    })(AbstractElementManager);
    return HTMLElementManager;
});
