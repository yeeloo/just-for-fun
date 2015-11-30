define(["require", "exports"], function (require, exports) {
    var ComponentType;
    (function (ComponentType) {
        ComponentType[ComponentType["UNKNOWN"] = 0] = "UNKNOWN";
        ComponentType[ComponentType["CONTAINER"] = 1] = "CONTAINER";
        ComponentType[ComponentType["IMAGE"] = 2] = "IMAGE";
        ComponentType[ComponentType["BUTTON"] = 3] = "BUTTON";
        ComponentType[ComponentType["TEXT"] = 4] = "TEXT";
        ComponentType[ComponentType["SHAPE"] = 5] = "SHAPE";
        ComponentType[ComponentType["DEBUG"] = 6] = "DEBUG";
    })(ComponentType || (ComponentType = {}));
    return ComponentType;
});
