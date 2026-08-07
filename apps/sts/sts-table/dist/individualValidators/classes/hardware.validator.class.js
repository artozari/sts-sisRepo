"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareValidatorClass = void 0;
const class_validator_1 = require("class-validator");
const colors_lights_enum_1 = require("../../interfaces/enums/colors.lights.enum");
class HardwareValidatorClass {
    // constructor(p_mqtt: MqttValidatorClass) {
    constructor(p_data) {
        this.id = p_data.id;
        this.colorOfLights = p_data.colorOfLights;
        this.lightsIntensity = p_data.lightsIntensity;
        this.semaphoreIntensity = p_data.semaphoreIntensity;
        this.tableNumber = p_data.tableNumber;
    }
}
exports.HardwareValidatorClass = HardwareValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)()
], HardwareValidatorClass.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(colors_lights_enum_1.ColorsLightsEnum)
], HardwareValidatorClass.prototype, "colorOfLights", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10)
], HardwareValidatorClass.prototype, "lightsIntensity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10)
], HardwareValidatorClass.prototype, "semaphoreIntensity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100)
], HardwareValidatorClass.prototype, "tableNumber", void 0);
