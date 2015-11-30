define(["require", "exports"], function (require, exports) {
    var CalculationUnitType;
    (function (CalculationUnitType) {
        CalculationUnitType[CalculationUnitType["ADDITION"] = 0] = "ADDITION";
        CalculationUnitType[CalculationUnitType["SUBSTRACTION"] = 1] = "SUBSTRACTION";
        CalculationUnitType[CalculationUnitType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
        CalculationUnitType[CalculationUnitType["DIVISION"] = 3] = "DIVISION";
    })(CalculationUnitType || (CalculationUnitType = {}));
    return CalculationUnitType;
});
