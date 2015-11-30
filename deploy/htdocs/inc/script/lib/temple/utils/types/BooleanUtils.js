define(["require", "exports"], function (require, exports) {
    /**
     * This class contains some functions for Booleans.
     *
     * @author Thijs Broerse
     */
    var BooleanUtils = (function () {
        function BooleanUtils() {
        }
        /**
         * Attempts to convert a object to a native boolean.
         */
        BooleanUtils.getBoolean = function (value) {
            if (!value) {
                return false;
            }
            if (typeof value === 'object') {
                value = String(value);
            }
            if (typeof value === 'string') {
                value.toString().toLowerCase();
            }
            switch (value) {
                case true:
                case 'on':
                case 'true':
                case 'yes':
                case '1':
                case 1:
                    {
                        return true;
                    }
            }
            return false;
        };
        return BooleanUtils;
    })();
    return BooleanUtils;
});
