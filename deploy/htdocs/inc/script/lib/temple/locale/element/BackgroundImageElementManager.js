var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractElementManager', './data/ImageElementData'], function (require, exports, AbstractElementManager, ImageElementData) {
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @extend temple.locale.element.AbstractElementManager
     * @class BackgroundImageElementManager
     */
    var BackgroundImageElementManager = (function (_super) {
        __extends(BackgroundImageElementManager, _super);
        function BackgroundImageElementManager() {
            _super.call(this);
        }
        BackgroundImageElementManager.getInstance = function () {
            if (typeof BackgroundImageElementManager._instance === 'undefined') {
                BackgroundImageElementManager._instance = new BackgroundImageElementManager();
            }
            return BackgroundImageElementManager._instance;
        };
        /**
         * @public
         * @method add
         * @param {HTMLElement} element
         * @param {string} url
         */
        BackgroundImageElementManager.prototype.add = function (element, url) {
            if (url === void 0) { url = null; }
            if (!element || typeof element === 'undefined') {
                console.error('no element ', element);
                return;
            }
            if (!url) {
                var bgImage = ((typeof window.getComputedStyle !== 'undefined' && window.getComputedStyle(element, null)) || element.currentStyle).backgroundImage;
                if (bgImage) {
                    url = bgImage.replace(/\/([a-z]{2}_[A-Z]{2})\//gi, '/{locale}/');
                }
                if (url.substr(0, 4) == 'url(') {
                    url = url.substring(4, url.length - 1);
                }
            }
            if (!element || typeof element === 'undefined') {
                console.error('missing url', element);
                return;
            }
            //		console.log('>>> URL: ', url);
            _super.prototype.addElement.call(this, new ImageElementData(element, url));
        };
        /**
         * @public
         * @method updateElement
         * @param {ImageElementData} data
         */
        BackgroundImageElementManager.prototype.updateElement = function (data) {
            console.log('UPDATE BG IMAGE: ', data.url);
            $(data.element).css('backgroundImage', 'url(' + data.url.replace('{locale}', this._localeManager.getLocale()) + ')');
        };
        return BackgroundImageElementManager;
    })(AbstractElementManager);
    return BackgroundImageElementManager;
});
