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
exports.CreateConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sts_common_1 = require("sts-common");
const languages_class_1 = require("@slcn-pkg/languages-class");
class CreateConfigurationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { lightsIntensity: { required: true, type: () => Number, minimum: 0, maximum: 10 }, semaphoreIntensity: { required: true, type: () => Number, minimum: 0, maximum: 10 }, semaphoreTime: { required: true, type: () => Number, minimum: 5, maximum: 30 }, semaphoreGreen: { required: true, type: () => Number, minimum: 2, maximum: 30 }, semaphoreYellow: { required: true, type: () => Number, minimum: 1, maximum: 30 }, statisticsQ: { required: true, enum: require("../../../../../../packages/sts-common/dist/wheel/enums/statistics.q.enum").StatisticsQEnum }, colorOfLights: { required: true, enum: require("../../../../../../packages/sts-common/dist/wheel/enums/color.of.lights.enum").ColorOfLightsEnum }, skin: { required: true, enum: require("../../../../../../packages/sts-common/dist/wheel/enums/skin.enum").SkinEnum }, skin2: { required: true, type: () => Object, enum: sts_common_1.SkinOffArray }, skin3: { required: true, type: () => Object, enum: sts_common_1.SkinOffArray }, skin4: { required: true, type: () => Object, enum: sts_common_1.SkinOffArray }, skin5: { required: true, type: () => Object }, skin6: { required: true, type: () => Object }, skin7: { required: true, type: () => Object }, skin8: { required: true, type: () => Object }, skinRotationTime: { required: true, type: () => Number, enum: sts_common_1.SkinRotationTimeArray }, wheelType: { required: true, enum: require("../../../../../../packages/sts-common/dist/wheel/enums/wheel.type.enum").WheelTypeEnum }, max: { required: true, type: () => Number, minimum: 1 }, min: { required: true, type: () => Number, minimum: 1 }, chip: { required: true, type: () => Number, minimum: 1, maximum: 100000000 }, description: { required: true, type: () => String }, b36: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, b18: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, b12: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, b9: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, b7: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, b6: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, bCha1: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, bCha2: { required: true, type: () => Number, minimum: 1, maximum: 1000000 }, userId: { required: true, type: () => Number, minimum: 1 }, lang: { required: true, type: () => String, enum: languages_class_1.LANGSCODES }, lang2: { required: true, type: () => String, enum: languages_class_1.LANGSCODES_OFF }, lang3: { required: true, type: () => String, enum: languages_class_1.LANGSCODES_OFF }, croupierLang: { required: true, type: () => String, enum: languages_class_1.LANGSCODES }, croupierLang2: { required: true, type: () => String, enum: languages_class_1.LANGSCODES_OFF }, croupierLang3: { required: true, type: () => String, enum: languages_class_1.LANGSCODES_OFF } };
    }
}
exports.CreateConfigurationDto = CreateConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 4,
        description: 'Maximum intensity of lights',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "lightsIntensity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5,
        description: 'Maximum semaphore intensity',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "semaphoreIntensity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5,
        description: 'Time interval for analyzing the semaphore.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(30),
    (0, class_validator_1.Min)(5),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "semaphoreTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5,
        description: 'Green level to analyze the semaphore in the time interval.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(30),
    (0, class_validator_1.Min)(2),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "semaphoreGreen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5,
        description: 'Yellow level to analyze the semaphore in the time interval.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(30),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "semaphoreYellow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 200,
        description: 'Number of samples for statistics',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.StatisticsQEnum),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "statisticsQ", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'green',
        description: 'Color of lights',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.ColorOfLightsEnum),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "colorOfLights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'BOX',
        description: 'Screen skin 1',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.SkinEnum),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'BALL',
        description: 'Screen skin 2',
    }),
    (0, class_validator_1.IsIn)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'LIGHT_NEON_PINK',
        description: 'Screen skin 3',
    }),
    (0, class_validator_1.IsIn)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'CHINESE_96',
        description: 'Screen skin 4',
    }),
    (0, class_validator_1.IsIn)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'RACING',
        description: 'Screen skin 5',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin5", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'OFF',
        description: 'Screen skin 6',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin6", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'OFF',
        description: 'Screen skin 7',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin7", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'OFF',
        description: 'Screen skin 8',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.SkinOffArray),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "skin8", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 60,
        description: 'Skin rotation time',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)(sts_common_1.SkinRotationTimeArray),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "skinRotationTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'FR37',
        description: 'Wheel type',
    }),
    (0, class_validator_1.IsEnum)(sts_common_1.WheelTypeEnum),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "wheelType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 1000000,
        description: 'Maximum bet in cents',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 1000,
        description: 'Minimum bet in cents',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 1000,
        description: 'Chip value',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "chip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: false,
        example: 'Regular table configuration.',
        description: 'Configuration description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 1000,
        description: 'Maximum bet for payouts of 36',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b36", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 2000,
        description: 'Maximum bet for payouts of 18',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b18", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 3000,
        description: 'Maximum bet for payouts of 12',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b12", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 4000,
        description: 'Maximum bet for payouts of 9',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b9", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5000,
        description: 'Maximum bet for payouts of 7',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b7", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 6000,
        description: 'Maximum bet for payouts of 6',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "b6", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 30000,
        description: 'Maximum bet for payouts of cha1 (simple)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "bCha1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 20000,
        description: 'Maximum bet for payouts of cha2 (doble)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "bCha2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        required: false,
        example: 1,
        description: 'User identifier',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateConfigurationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'es',
        description: 'Active Language Identifier',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "lang", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'es',
        description: 'Active Language Identifier 2',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES_OFF),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "lang2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'OFF',
        description: 'Active Language Identifier 3',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES_OFF),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "lang3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'es',
        description: 'Active Language Identifier',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "croupierLang", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'es',
        description: 'Active Language Identifier 2',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES_OFF),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "croupierLang2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'OFF',
        description: 'Active Language Identifier 3',
    }),
    (0, class_validator_1.IsIn)(languages_class_1.LANGSCODES_OFF),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "croupierLang3", void 0);
//# sourceMappingURL=create-configuration.dto.js.map