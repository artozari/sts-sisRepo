"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinOffArray = void 0;
const skin_enum_1 = require("../enums/skin.enum");
var OffEnum;
(function (OffEnum) {
    OffEnum["OFF"] = "OFF";
})(OffEnum || (OffEnum = {}));
exports.SkinOffArray = Object.values(OffEnum).concat(Object.values(skin_enum_1.SkinEnum));
