define(["require", "exports"], function (require, exports) {
    var CalculationType;
    (function (CalculationType) {
        CalculationType[CalculationType["UNKOWN"] = 0] = "UNKOWN";
        CalculationType[CalculationType["FLUID"] = 1] = "FLUID";
        CalculationType[CalculationType["STATIC"] = 2] = "STATIC";
        CalculationType[CalculationType["CALC"] = 3] = "CALC";
    })(CalculationType || (CalculationType = {}));
    return CalculationType;
});
