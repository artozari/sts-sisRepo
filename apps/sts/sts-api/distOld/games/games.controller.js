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
exports.GamesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const games_service_1 = require("./games.service");
const create_game_dto_1 = require("./dto/create-game.dto");
const update_game_dto_1 = require("./dto/update-game.dto");
const swagger_1 = require("@nestjs/swagger");
const enable_game_dto_1 = require("./dto/enable-game.dto");
let GamesController = class GamesController {
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    create(createGameDto) {
        return this.gamesService.create(createGameDto);
    }
    async findAll(q, table, enabled) {
        return await this.gamesService.findAll(+q, +table, enabled);
    }
    findOne(id) {
        return this.gamesService.findOne(+id);
    }
    update(id, updateGameDto) {
        return this.gamesService.update(+id, updateGameDto);
    }
    enable(id, enableGameDto) {
        return this.gamesService.enabled(+id, enableGameDto);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new game.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate entry.' }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./dto/create-game.dto").CreateGameDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.CreateGameDto]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all games.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found.' }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        type: String,
        description: 'Quantity of results to return',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'table',
        type: String,
        description: 'Table identifier',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'enabled',
        type: Boolean,
        description: 'Enabling the gaming table',
        required: false,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('table')),
    __param(2, (0, common_1.Query)('enabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a single game.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found.' }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a game.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found.' }),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_game_dto_1.UpdateGameDto]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Enable or disable a game.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Process completed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Game not found.' }),
    (0, common_1.Patch)('enable/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, enable_game_dto_1.EnableGameDto]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "enable", null);
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('Games'),
    (0, common_1.Controller)({
        path: 'game',
        version: '1',
    }),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map