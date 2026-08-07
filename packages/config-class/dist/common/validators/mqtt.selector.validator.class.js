"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttSelectorValidatorClass = void 0;
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const mqtt_selector_validator_interface_1 = require("../interfaces/mqtt.selector.validator.interface");
class MqttSelectorValidatorClass {
    // constructor(p_url: string, p_port: string, p_protocol: string, p_username: string, p_password: string) {
    constructor(p_data) {
        this.selector = p_data.selector;
    }
}
exports.MqttSelectorValidatorClass = MqttSelectorValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsEnum)(mqtt_selector_validator_interface_1.MqttSelectorValidatorEnum)
], MqttSelectorValidatorClass.prototype, "selector", void 0);
