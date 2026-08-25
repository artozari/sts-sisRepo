"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndividualValidatorClass = void 0;
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const config_class_1 = require("@slcn-pkg/config-class");
const hardware_validator_class_1 = require("./hardware.validator.class");
const wheel_validator_class_1 = require("./wheel.validator.class");
const signboard_validator_class_1 = require("./signboard.validator.class");
class IndividualValidatorClass {
    constructor(p_data) {
        this.CONFIG_FILE = new config_class_1.ConfigFileValidatorClass(p_data.CONFIG_FILE);
        this.HARDWARE = new hardware_validator_class_1.HardwareValidatorClass(p_data.HARDWARE);
        this.HTTP = new config_class_1.HttpValidatorClass(p_data.HTTP);
        this.WHEEL = new wheel_validator_class_1.WheelValidatorClass(p_data.WHEEL);
        this.SIGNBOARD = new signboard_validator_class_1.SignboardValidatorClass(p_data.SIGNBOARD);
        this.API = new config_class_1.ApiValidatorClass(p_data.API);
        this.LOGGER = new config_class_1.GeneralLoggerValidatorClass(p_data.LOGGER);
    }
}
exports.IndividualValidatorClass = IndividualValidatorClass;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.ConfigFileValidatorClass)
], IndividualValidatorClass.prototype, "CONFIG_FILE", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => IndividualValidatorClass)
], IndividualValidatorClass.prototype, "HARDWARE", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.HttpValidatorClass)
], IndividualValidatorClass.prototype, "HTTP", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => wheel_validator_class_1.WheelValidatorClass)
], IndividualValidatorClass.prototype, "WHEEL", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => signboard_validator_class_1.SignboardValidatorClass)
], IndividualValidatorClass.prototype, "SIGNBOARD", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.ApiValidatorClass)
], IndividualValidatorClass.prototype, "API", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.GeneralLoggerValidatorClass)
], IndividualValidatorClass.prototype, "LOGGER", void 0);
