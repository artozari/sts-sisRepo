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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutoffController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cutoff_service_1 = require("./cutoff.service");
const create_cutoff_dto_1 = require("./dto/create-cutoff.dto");
const update_cutoff_dto_1 = require("./dto/update-cutoff.dto");
let CutoffController = class CutoffController {
    constructor(cutoffService) {
        this.cutoffService = cutoffService;
    }
    create(createCutoffDto) {
        return this.cutoffService.create(createCutoffDto);
    }
    findAll() {
        return this.cutoffService.findAll();
    }
    findLastCutoff() {
        return this.cutoffService.findLastCutoff();
    }
    findOne(id) {
        return this.cutoffService.findOne(+id);
    }
    update(id, updateCutoffDto) {
        return this.cutoffService.update(+id, updateCutoffDto);
    }
    addKey(id, body) {
        if (body && id) {
            return this.cutoffService.update(+id, body);
        }
        else {
            return { error: 'Clave o ID no proporcionados' };
        }
    }
    remove(id) {
        return this.cutoffService.remove(+id);
    }
};
exports.CutoffController = CutoffController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cutoff_dto_1.CreateCutoffDto]),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('last'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "findLastCutoff", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cutoff_dto_1.UpdateCutoffDto]),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/add-key'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cutoff_dto_1.UpdateCutoffDto]),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "addKey", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CutoffController.prototype, "remove", null);
exports.CutoffController = CutoffController = __decorate([
    (0, common_1.Controller)('cutoff'),
    __metadata("design:paramtypes", [cutoff_service_1.CutoffService])
], CutoffController);
//# sourceMappingURL=cutoff.controller.js.map