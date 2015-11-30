define(["require", "exports"], function (require, exports) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteRequirement
     */
    var GaiaRouteRequirement = (function () {
        function GaiaRouteRequirement(name, assertion) {
            this.name = name;
            this.assertion = assertion;
            var check = '';
            if (typeof this.assertion !== 'function') {
                check = this.assertion.toString();
            }
            if (check) {
                if (check.charAt(0) != '^') {
                    console.warn('Missing ^ at the beginning, this might be unintential.', name, this.assertion);
                }
                if (this.assertion.charAt(this.assertion.length - 1) != '$') {
                    console.warn('Missing $ at the end, this might be unintential.', name, this.assertion);
                }
            }
        }
        /**
         * @method assert
         * @param {string} value
         * @returns {boolean}
         */
        GaiaRouteRequirement.prototype.assert = function (value) {
            // string
            if (typeof this.assertion === 'string') {
                return value['test'](new RegExp(this.assertion, 'i'));
            }
            else if (typeof this.assertion === 'function') {
                return this.assertion(value);
            }
            else {
                return value['test'](this.assertion);
            }
        };
        return GaiaRouteRequirement;
    })();
    return GaiaRouteRequirement;
});
