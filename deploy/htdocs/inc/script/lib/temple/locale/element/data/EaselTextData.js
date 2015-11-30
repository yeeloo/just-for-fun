var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractElementData'], function (require, exports, AbstractElementData) {
    /**
     * @module Temple
     * @namespace temple.locale.element.data
     * @extend temple.locale.element.data.AbstractElementData
     * @class EaselTextData
     */
    var EaselTextData = (function (_super) {
        __extends(EaselTextData, _super);
        function EaselTextData(element, id, key) {
            _super.call(this, element);
            this.id = id;
            this.key = key;
        }
        return EaselTextData;
    })(AbstractElementData);
    return EaselTextData;
});
