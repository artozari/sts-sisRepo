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
exports.CasinoController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const casino_service_1 = require("./casino.service");
const create_casino_dto_1 = require("./dto/create-casino.dto");
const update_casino_dto_1 = require("./dto/update-casino.dto");
const swagger_1 = require("@nestjs/swagger");
let CasinoController = class CasinoController {
    constructor(casinoService) {
        this.casinoService = casinoService;
    }
    create(createCasinoDto) {
        return this.casinoService.create(createCasinoDto);
    }
    findAll(q) {
        return this.casinoService.findAll(+q);
    }
    findOne(id) {
        return this.casinoService.findOne(+id);
    }
    update(id, updateCasinoDto) {
        return this.casinoService.update(+id, updateCasinoDto);
    }
    remove(id) {
        return this.casinoService.remove(+id);
    }
};
exports.CasinoController = CasinoController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new casino.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate entry.' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_casino_dto_1.CreateCasinoDto]),
    __metadata("design:returntype", void 0)
], CasinoController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all casinos.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found.' }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        type: String,
        description: 'Quantity of results to return',
        required: false,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./entities/casino.entity").CasinoEntityInterface] }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CasinoController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a single casino.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Casino ID', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found.' }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/casino.entity").CasinoEntityInterface }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CasinoController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a casino.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Casino ID', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Casino not found.' }),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_casino_dto_1.UpdateCasinoDto]),
    __metadata("design:returntype", void 0)
], CasinoController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a casino.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Casino not found.' }),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CasinoController.prototype, "remove", null);
exports.CasinoController = CasinoController = __decorate([
    (0, swagger_1.ApiTags)('Casino'),
    (0, common_1.Controller)({
        path: 'casino',
        version: '1',
    }),
    __metadata("design:paramtypes", [casino_service_1.CasinoService])
], CasinoController);
//# sourceMappingURL=casino.controller.js.map