"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndividualValidatorClass = void 0;
const class_transformer_1 = require("class-transformer");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const config_class_1 = require("@slcn-pkg/config-class");
class IndividualValidatorClass {
    constructor(p_data) {
        this.CONFIG_FILE = new config_class_1.ConfigFileValidatorClass(p_data.CONFIG_FILE);
        this.COMM = new config_class_1.ComValidatorClass(p_data.COMM);
        this.HTTP = new config_class_1.HttpValidatorClass(p_data.HTTP);
        this.LOGGER = new config_class_1.GeneralLoggerValidatorClass(p_data.LOGGER);
    }
}
exports.IndividualValidatorClass = IndividualValidatorClass;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.ConfigFileValidatorClass),
    __metadata("design:type", Object)
], IndividualValidatorClass.prototype, "CONFIG_FILE", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.HttpValidatorClass),
    __metadata("design:type", config_class_1.HttpValidatorClass)
], IndividualValidatorClass.prototype, "HTTP", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => IndividualValidatorClass),
    __metadata("design:type", config_class_1.ComValidatorClass)
], IndividualValidatorClass.prototype, "COMM", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => config_class_1.GeneralLoggerValidatorClass),
    __metadata("design:type", config_class_1.GeneralLoggerValidatorClass)
], IndividualValidatorClass.prototype, "LOGGER", void 0);
