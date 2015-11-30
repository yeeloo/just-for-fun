define(["require", "exports"], function (require, exports) {
    var CSSTransform = (function () {
        function CSSTransform() {
        }
        CSSTransform.getProperty = function () {
            var div = document.createElement('div');
            for (var i = 0; i < CSSTransform._PROPERTIES.length; i++) {
                var prop = CSSTransform._PROPERTIES[i];
                if (div.style[prop] !== void 0) {
                    return prop;
                }
            }
            // return unprefixed version by default
            return CSSTransform._PROPERTIES[0];
        };
        CSSTransform._PROPERTIES = [
            'transform',
            'webkitTransform',
            'MozTransform',
            'OTransform',
            'msTransform'
        ];
        CSSTransform.PROPERTY = CSSTransform.getProperty();
        return CSSTransform;
    })();
    return CSSTransform;
});
