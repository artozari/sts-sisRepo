"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AedesValidatorClass = void 0;
require("reflect-metadata");
const class_validator_1 = require("class-validator");
class AedesValidatorClass {
    // constructor(p_url: string, p_port: string, p_protocol: string, p_username: string, p_password: string) {
    constructor(p_data) {
        this.port = p_data.port;
        this.portWs = p_data.portWs;
        this.tls = p_data.tls;
        this.clientPrefix = p_data.clientPrefix;
        this.password = p_data.password;
        this.username = p_data.username;
    }
}
exports.AedesValidatorClass = AedesValidatorClass;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsPort)()
], AedesValidatorClass.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsPort)()
], AedesValidatorClass.prototype, "portWs", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)()
], AedesValidatorClass.prototype, "tls", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)()
], AedesValidatorClass.prototype, "clientPrefix", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(20)
], AedesValidatorClass.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
], AedesValidatorClass.prototype, "password", void 0);
