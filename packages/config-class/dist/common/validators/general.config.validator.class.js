"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralConfigValidatorClass = void 0;
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const mqtt_validator_class_1 = require("./mqtt.validator.class");
const mac_validator_class_1 = require("./mac.validator.class");
const config_file_validator_class_1 = require("./config.file.validator.class");
const redis_validator_class_1 = require("./redis.validator.class");
const account_validator_class_1 = require("./account.validator.class");
class GeneralConfigValidatorClass {
    // constructor(p_mqtt: MqttValidatorClass) {
    constructor(p_data) {
        this.MQTT = new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT);
        this.MQTT_1 = p_data.MQTT_1 ? new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT_1) : undefined;
        this.MQTT_2 = p_data.MQTT_2 ? new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT_2) : undefined;
        this.MQTT_3 = p_data.MQTT_3 ? new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT_3) : undefined;
        this.MQTT_4 = p_data.MQTT_4 ? new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT_4) : undefined;
        this.MQTT_5 = p_data.MQTT_5 ? new mqtt_validator_class_1.MqttValidatorClass(p_data.MQTT_5) : undefined;
        this.MAC_ID = new mac_validator_class_1.MacValidatorClass(p_data.MAC_ID);
        this.CONFIG_FILE = new config_file_validator_class_1.ConfigFileValidatorClass(p_data.CONFIG_FILE);
        this.REDIS = p_data.REDIS ? new redis_validator_class_1.RedisValidatorClass(p_data.REDIS) : undefined;
        this.ADMIN = new account_validator_class_1.AccountValidatorClass(p_data.ADMIN);
        this.USER = new account_validator_class_1.AccountValidatorClass(p_data.USER);
    }
}
exports.GeneralConfigValidatorClass = GeneralConfigValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT_1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT_2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT_3", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT_4", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mqtt_validator_class_1.MqttValidatorClass)
], GeneralConfigValidatorClass.prototype, "MQTT_5", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => mac_validator_class_1.MacValidatorClass)
], GeneralConfigValidatorClass.prototype, "MAC_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_file_validator_class_1.ConfigFileValidatorClass)
], GeneralConfigValidatorClass.prototype, "CONFIG_FILE", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => redis_validator_class_1.RedisValidatorClass)
], GeneralConfigValidatorClass.prototype, "REDIS", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => account_validator_class_1.AccountValidatorClass)
], GeneralConfigValidatorClass.prototype, "ADMIN", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => account_validator_class_1.AccountValidatorClass)
], GeneralConfigValidatorClass.prototype, "USER", void 0);
