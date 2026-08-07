"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComValidatorClass = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("../enums");
class ComValidatorClass {
    // constructor(p_mqtt: MqttValidatorClass) {
    constructor(p_data) {
        this.port = p_data.port;
        this.baudRate = p_data.baudRate;
        this.dataBits = p_data.dataBits;
        this.stopBits = p_data.stopBits;
        this.parity = p_data.parity;
        this.timeout = p_data.timeout;
    }
}
exports.ComValidatorClass = ComValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)()
], ComValidatorClass.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(enums_1.ComBaudrateEnum)
], ComValidatorClass.prototype, "baudRate", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(enums_1.ComDataBitsEnum)
], ComValidatorClass.prototype, "dataBits", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(enums_1.ComStopBitsEnum)
], ComValidatorClass.prototype, "stopBits", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(enums_1.ComParityBitEnum)
], ComValidatorClass.prototype, "parity", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(enums_1.ComTimeoutEnum)
], ComValidatorClass.prototype, "timeout", void 0);
