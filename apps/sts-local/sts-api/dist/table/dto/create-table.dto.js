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
exports.CreateTableDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTableDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String, minLength: 20, maxLength: 50 }, name: { required: true, type: () => String, minLength: 3, maxLength: 15 }, shortName: { required: true, type: () => String, minLength: 3, maxLength: 5 }, posX: { required: true, type: () => Number, minimum: -1, maximum: 5000 }, posY: { required: true, type: () => Number, minimum: -1, maximum: 5000 }, layout: { required: true, type: () => Number, minimum: 0, maximum: 20 }, noSmoking: { required: true, type: () => Boolean }, tableNumber: { required: true, type: () => Number, minimum: 0, maximum: 99 }, configTableId: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.CreateTableDto = CreateTableDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'sts-table__0a002700000e__8020__9020',
        description: 'The key of the table',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(20, 50),
    __metadata("design:type", String)
], CreateTableDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'Table 01',
        description: 'The name of the table',
    }),
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 15),
    __metadata("design:type", String)
], CreateTableDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: 'T01',
        description: 'The short name of the table',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 5),
    __metadata("design:type", String)
], CreateTableDto.prototype, "shortName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: -1,
        description: 'Table X position in the casino.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], CreateTableDto.prototype, "posX", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: -1,
        description: 'Table Y position in the casino.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], CreateTableDto.prototype, "posY", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: -1,
        description: 'Casino layout.',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreateTableDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        required: true,
        example: true,
        description: 'Indicate whether smoking is allowed or not.',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTableDto.prototype, "noSmoking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 5,
        description: 'Table number (ID)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(99),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTableDto.prototype, "tableNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        required: true,
        example: 1,
        description: 'Configuration table identifier (ID)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTableDto.prototype, "configTableId", void 0);
//# sourceMappingURL=create-table.dto.js.map