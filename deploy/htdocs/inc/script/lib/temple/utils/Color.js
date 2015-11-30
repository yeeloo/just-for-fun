/**
 * @overview Color utility class
 * @author Arthur Dam <arthur@mediamonks.com>
 * @version 0.1
 * @copyright MediaMonks B.V. 2014
 */
define(["require", "exports"], function (require, exports) {
    var Color = (function () {
        /**
         * An empty initiation
         * @constructor
         */
        function Color() {
            this.a = 1;
        }
        /**
         * Set value based on hex string
         * @param {string} hex - Input string
         */
        Color.prototype.setHex = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        };
        /**
         * Get hex value
         * @returns {string}
         */
        Color.prototype.getHex = function () {
            return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
        };
        /**
         * Set value based on "rgb()" string
         * @param {string} rgb - Input string
         */
        Color.prototype.setRgbString = function (rgb) {
            var result = rgb.replace(/[^\d,]/g, '').split(',');
            var r = parseInt(result[0], 10);
            var g = parseInt(result[1], 10);
            var b = parseInt(result[2], 10);
            if (result.length !== 3 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0) {
                console.log('setRgbString: ' + rgb + 'is not a valid input!');
                return;
            }
            this.r = r;
            this.g = g;
            this.b = b;
        };
        /**
         * Get rgb() string
         * @returns {string}
         */
        Color.prototype.getRgbString = function () {
            return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        };
        /**
         * Set value based on "rgba()" string
         * @param {string} rgba - Input string
         */
        Color.prototype.setRgbaString = function (rgba) {
            var result = rgba.replace(/[^\d,]/g, '').split(',');
            var r = parseInt(result[0], 10);
            var g = parseInt(result[1], 10);
            var b = parseInt(result[2], 10);
            var a = parseInt(result[3], 10);
            if (result.length !== 4 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0 || a > 1 || a < 0) {
                console.log('setRgbaString: ' + rgba + 'is not a valid input!');
                return;
            }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        };
        /**
         * Get rgba() string
         * @returns {string}
         */
        Color.prototype.getRgbaString = function () {
            return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
        };
        /**
         * Set value based on direct input
         * @param {object} rgb - Input object (r:number; g:number; b:number; a?:number (optional))
         */
        Color.prototype.setRgb = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            if (color.a)
                this.a = color.a;
        };
        /**
         * Get rgb
         * @returns {object}
         */
        Color.prototype.getRgb = function () {
            return {
                r: this.r,
                g: this.g,
                b: this.b
            };
        };
        /**
         * Set value based on hsl input
         * @param {object} hsl - Input object (h:number; s:number; l:number;)
         */
        Color.prototype.setHsl = function (color) {
            this.h = color.h;
            this.s = color.s;
            this.l = color.l;
            this.hslToRgb();
        };
        /**
         * Get hsl
         * @returns {object}
         */
        Color.prototype.getHsl = function () {
            this.rgbToHsl();
            return {
                h: this.h,
                s: this.s,
                l: this.l
            };
        };
        /**
         * Set value based on hsv input
         * @param {object} hsv - Input object (h:number; s:number; v:number;)
         */
        Color.prototype.setHsv = function (color) {
            this.h = color.h;
            this.s = color.s;
            this.v = color.v;
            this.hsvToRgb();
        };
        /**
         * Get hsv
         * @returns {object}
         */
        Color.prototype.getHsv = function () {
            this.rgbToHsl();
            return {
                h: this.h,
                s: this.s,
                v: this.v
            };
        };
        /**
         * Set hue
         * @param {number} hue - Input hue
         */
        Color.prototype.setHue = function (hue) {
            this.h = hue;
            this.hslToRgb();
        };
        /**
         * Get hue
         * @returns {number}
         */
        Color.prototype.getHue = function () {
            this.rgbToHsl();
            return this.h;
        };
        /**
         * Set saturation
         * @param {number} saturation - Input saturation
         */
        Color.prototype.setSaturation = function (saturation) {
            this.s = saturation;
            this.hsvToRgb();
        };
        /**
         * Get saturation
         * @returns {number}
         */
        Color.prototype.getSaturation = function () {
            this.rgbToHsl();
            return this.s;
        };
        /**
         * Set brightness
         * @param {number} brightness - Input brightness
         */
        Color.prototype.setBrightness = function (brightness) {
            this.v = brightness;
            this.hsvToRgb();
        };
        /**
         * Get brightness
         * @returns {number}
         */
        Color.prototype.getBrightness = function () {
            this.rgbToHsl();
            return this.v;
        };
        /**
         * Set lightness
         * @param {number} lightness - Input lightness
         */
        Color.prototype.setLightness = function (lightness) {
            this.l = lightness;
            this.hslToRgb();
        };
        /**
         * Get lightness
         * @returns {number}
         */
        Color.prototype.getLightness = function () {
            this.rgbToHsl();
            return this.v;
        };
        /**
         * Applies matrix color operation to the color
         * @param {number[]} m - Color transformation matrix
         */
        Color.prototype.applyMatrixFilter = function (m) {
            if (m.length < 20)
                return;
            this.r = this.r * m[0] + this.g * m[1] + this.b * m[2] + this.a * m[3] + m[4];
            this.g = this.r * m[5] + this.g * m[6] + this.b * m[7] + this.a * m[8] + m[9];
            this.b = this.r * m[10] + this.g * m[11] + this.b * m[12] + this.a * m[13] + m[14];
            this.a = this.r * m[15] + this.g * m[16] + this.b * m[17] + this.a * m[18] + m[19];
        };
        /**
         * Interpolates between two colors
         * @param {Color} destination - Color to interpolate to
         * @param {number} factor - Interpolation factor
         * @returns {Color}
         */
        Color.prototype.interpolate = function (destination, factor) {
            this.r = Color.absround(+(this.r) + (destination.r - this.r) * factor);
            this.g = Color.absround(+(this.g) + (destination.g - this.g) * factor);
            this.b = Color.absround(+(this.b) + (destination.b - this.b) * factor);
            this.a = Color.absround(+(this.a) + (destination.a - this.a) * factor);
            return this;
        };
        /**
         * @private
         * converts object's rgb to hsl
         */
        Color.prototype.rgbToHsl = function () {
            var r = this.r / Color.CLAMP;
            var g = this.g / Color.CLAMP;
            var b = this.b / Color.CLAMP;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var l = (max + min) / 2;
            var v = max;
            if (max == min) {
                this.h = 0;
                this.s = 0;
                this.l = Color.absround(l * 100);
                this.v = Color.absround(v * 100);
                return;
            }
            var _d = max - min;
            var _s = _d / ((l <= 0.5) ? (max + min) : (2 - max - min));
            var _h = ((max == r) ? (g - b) / _d + (g < b ? 6 : 0) : (max == g) ? ((b - r) / _d + 2) : ((r - g) / _d + 4)) / 6;
            this.h = Color.absround(_h * 360);
            this.s = Color.absround(_s * 100);
            this.l = Color.absround(l * 100);
            this.v = Color.absround(v * 100);
        };
        /**
         * @private
         * converts object's hsl to rgb
         */
        Color.prototype.hslToRgb = function () {
            var h = this.h / 360;
            var s = this.s / 100;
            var l = this.l / 100;
            var q = l < 0.5 ? l * (1 + s) : (l + s - l * s);
            var p = 2 * l - q;
            this.r = Color.absround(Color.hue2rgb(p, q, h + 1 / 3) * 255);
            this.g = Color.absround(Color.hue2rgb(p, q, h) * 255);
            this.b = Color.absround(Color.hue2rgb(p, q, h - 1 / 3) * 255);
        };
        /**
         * @private
         * converts object's hsv to rgb
         */
        Color.prototype.hsvToRgb = function () {
            var h = this.h / 360;
            var s = this.s / 100;
            var v = this.v / 100;
            var r = 0;
            var g = 0;
            var b = 0;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }
            this.r = Color.absround(r * 255);
            this.g = Color.absround(g * 255);
            this.b = Color.absround(b * 255);
        };
        /**
         * @private
         * makes a number absolute/rounded
         */
        Color.absround = function (c) {
            return (0.5 + c) << 0;
        };
        /**
         * @private
         * converts hue to rgb
         */
        Color.hue2rgb = function (a, b, c) {
            if (c < 0)
                c += 1;
            if (c > 1)
                c -= 1;
            if (c < 1 / 6)
                return a + (b - a) * 6 * c;
            if (c < 1 / 2)
                return b;
            if (c < 2 / 3)
                return a + (b - a) * (2 / 3 - c) * 6;
            return a;
        };
        Color.CLAMP = 0xFF;
        return Color;
    })();
    return Color;
});
