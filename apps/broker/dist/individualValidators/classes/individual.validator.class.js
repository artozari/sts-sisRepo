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
const config_class_1 = require("config-class");
const aedes_validator_class_1 = require("./aedes.validator.class");
class IndividualValidatorClass {
    constructor(p_data) {
        this.CONFIG_FILE = new config_class_1.ConfigFileValidatorClass(p_data.CONFIG_FILE);
        this.HTTP = new config_class_1.HttpValidatorClass(p_data.HTTP);
        this.AEDES = new aedes_validator_class_1.AedesValidatorClass(p_data.AEDES);
        this.MAC_ID = new config_class_1.MacValidatorClass(p_data.MAC_ID);
    }
}
exports.IndividualValidatorClass = IndividualValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => aedes_validator_class_1.AedesValidatorClass)
], IndividualValidatorClass.prototype, "AEDES", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.MacValidatorClass)
], IndividualValidatorClass.prototype, "MAC_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.ConfigFileValidatorClass)
], IndividualValidatorClass.prototype, "CONFIG_FILE", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.HttpValidatorClass)
], IndividualValidatorClass.prototype, "HTTP", void 0);
