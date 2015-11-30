define(["require", "exports"], function (require, exports) {
    var FormUtils = (function () {
        function FormUtils() {
        }
        FormUtils.getValue = function (name, form) {
            var input = $("[name='" + name + "']", form)[0];
            if (input) {
                return input.value;
            }
            else {
                console.error("No input found with name '" + name + "'");
            }
            return null;
        };
        return FormUtils;
    })();
    return FormUtils;
});
