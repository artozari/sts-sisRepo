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
exports.PingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const ping_service_1 = require("./ping.service");
const create_ping_dto_1 = require("./dto/create-ping.dto");
const update_ping_dto_1 = require("./dto/update-ping.dto");
const swagger_1 = require("@nestjs/swagger");
let PingController = class PingController {
    constructor(pingService) {
        this.pingService = pingService;
    }
    create(createPingDto) {
        return this.pingService.create(createPingDto);
    }
    findAll() {
        return this.pingService.findAll();
    }
    findOne(id) {
        return this.pingService.findOne(+id);
    }
    update(id, updatePingDto) {
        return this.pingService.update(+id, updatePingDto);
    }
    remove(id) {
        return this.pingService.remove(+id);
    }
};
exports.PingController = PingController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./dto/create-ping.dto").CreatePingDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ping_dto_1.CreatePingDto]),
    __metadata("design:returntype", void 0)
], PingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ping_dto_1.UpdatePingDto]),
    __metadata("design:returntype", void 0)
], PingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PingController.prototype, "remove", null);
exports.PingController = PingController = __decorate([
    (0, swagger_1.ApiTags)('ping'),
    (0, common_1.Controller)('ping'),
    __metadata("design:paramtypes", [ping_service_1.PingService])
], PingController);
//# sourceMappingURL=ping.controller.js.map