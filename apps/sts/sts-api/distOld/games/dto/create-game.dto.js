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
exports.CreateGameDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateGameDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { gameNumber: { required: true, type: () => Number, minimum: 0 }, winNumber: { required: true, type: () => Number, minimum: 0, maximum: 37 }, rpm: { required: true, type: () => Number, minimum: 0, maximum: 50 }, clockwise: { required: true, type: () => Boolean }, openTable: { required: true, type: () => Boolean }, croupierId: { required: true, type: () => Number, minimum: 1 }, tableId: { required: true, type: () => Number, minimum: 1 } };
    }
}
exports.CreateGameDto = CreateGameDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: 1, description: 'Game number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "gameNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: 1, description: 'Win number of a game' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(37),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "winNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: 1, description: 'Revolution per minute' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "rpm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: true, description: 'Clockwise direction' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGameDto.prototype, "clockwise", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: true, description: 'Open table status' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGameDto.prototype, "openTable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, required: false, example: 1, description: 'Croupier identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "croupierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: true, example: 1, description: 'Table identifier' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "tableId", void 0);
//# sourceMappingURL=create-game.dto.js.map