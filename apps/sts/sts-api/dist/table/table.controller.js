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
exports.TableController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const table_service_1 = require("./table.service");
const create_table_dto_1 = require("./dto/create-table.dto");
const update_table_dto_1 = require("./dto/update-table.dto");
const swagger_1 = require("@nestjs/swagger");
const enable_table_dto_1 = require("./dto/enable-table.dto");
let TableController = class TableController {
    constructor(tableService) {
        this.tableService = tableService;
    }
    create(createTableDto) {
        return this.tableService.create(createTableDto);
    }
    findAll() {
        return this.tableService.findAll();
    }
    findOne(id) {
        return this.tableService.findOne(+id);
    }
    findOneByKey(key) {
        return this.tableService.findOneByKey(key);
    }
    update(id, updateTableDto) {
        return this.tableService.update(+id, updateTableDto);
    }
    enable(id, enableTableDto) {
        return this.tableService.enabled(+id, enableTableDto);
    }
};
exports.TableController = TableController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a Table' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate entry.' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_1.CreateTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all Tables' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tables not found.' }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found.' }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Table by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found.' }),
    (0, common_1.Get)('key/:key'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findOneByKey", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a Table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found.' }),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_dto_1.UpdateTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Enable or disable a Table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found.' }),
    (0, common_1.Patch)('enable/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, enable_table_dto_1.EnableTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "enable", null);
exports.TableController = TableController = __decorate([
    (0, swagger_1.ApiTags)('Table'),
    (0, common_1.Controller)({
        path: 'table',
        version: '1',
    }),
    __metadata("design:paramtypes", [table_service_1.TableService])
], TableController);
//# sourceMappingURL=table.controller.js.map