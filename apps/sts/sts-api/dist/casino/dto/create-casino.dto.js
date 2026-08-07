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
exports.CreateCasinoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCasinoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { casinoCode: { required: true, type: () => String, minLength: 3, maxLength: 10 }, name: { required: true, type: () => String, minLength: 3, maxLength: 25 }, country: { required: true, type: () => String }, province: { required: true, type: () => String, minLength: 2, maxLength: 50 }, city: { required: true, type: () => String, minLength: 2, maxLength: 50 }, address: { required: true, type: () => String, minLength: 2, maxLength: 50 }, mqtt_url: { required: true, type: () => String }, mqtt_port: { required: true, type: () => String }, mqtt_protocol: { required: true, type: () => String }, mqtt_tls: { required: true, type: () => Boolean }, mqtt_user: { required: true, type: () => String, minLength: 6, maxLength: 15 }, mqtt_password: { required: true, type: () => String }, mqtt_refresh_time_msec: { required: true, type: () => Number } };
    }
}
exports.CreateCasinoDto = CreateCasinoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'CA_SLCN',
        description: 'Casino code (identifier)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 10),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "casinoCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Casino Sielcon',
        description: 'Casino name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 25),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'ARG',
        description: 'Casino country',
    }),
    (0, class_validator_1.IsISO31661Alpha3)(),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'CABA',
        description: 'Casino province',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Ciudad Autónoma de Buenos Aires',
        description: 'Casino city',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Camarones 2840',
        description: 'Casino address',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'sielcondev01.site',
        description: 'MQTT broker URL.',
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "mqtt_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: "9105",
        description: 'MQTT broker Port.',
    }),
    (0, class_validator_1.IsPort)(),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "mqtt_port", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'ws',
        description: 'MQTT protocol',
    }),
    (0, class_validator_1.IsEnum)(['mqtt', 'ws'], {
        message: "The property 'mqtt_protocol' must be one of the following values: 'mqtt' or 'ws'.",
    }),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "mqtt_protocol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        required: true,
        example: false,
        description: 'TLS or not',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCasinoDto.prototype, "mqtt_tls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Hernan',
        description: 'MQTT user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 15),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "mqtt_user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Hap1357.',
        description: 'MQTT password',
    }),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "mqtt_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 10,
        description: 'MQTT refresh time in seconds',
    }),
    (0, class_validator_1.IsEnum)([5, 10, 15, 20, 25, 30, 45, 60]),
    __metadata("design:type", Number)
], CreateCasinoDto.prototype, "mqtt_refresh_time_msec", void 0);
//# sourceMappingURL=create-casino.dto.js.map