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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GamesService = class GamesService {
    constructor(_prisma) {
        this._prisma = _prisma;
        this.findAll = async (q, table, enabledQuery) => {
            const tableId = isNaN(table) === false ? table : undefined;
            let enabled;
            if (enabledQuery === undefined)
                enabled = undefined;
            else if (enabledQuery.toLowerCase() === 'true')
                enabled = true;
            else if (enabledQuery.toLowerCase() === 'false')
                enabled = false;
            else
                enabled = undefined;
            const foundMany = await this._prisma.game_table.findMany({
                where: { tableId, enabled },
                orderBy: { id: 'desc' },
                take: isNaN(q) === false ? q : undefined,
            });
            if (foundMany.length === 0) {
                throw new common_1.NotFoundException('Games not found');
            }
            return foundMany;
        };
        this.findOne = async (id) => {
            const foundOne = await this._prisma.game_table.findUnique({
                where: { id },
            });
            if (!foundOne) {
                throw new common_1.NotFoundException(`Game with ID ${id} not found.`);
            }
            return foundOne;
        };
        this.enabled = async (id, enableGameDto) => {
            const enabledRecord = enableGameDto.enabled;
            return await this._prisma.game_table.update({
                where: {
                    id,
                },
                data: {
                    enabled: enabledRecord,
                },
            });
        };
    }
    async create(createGameDto) {
        try {
            const data = createGameDto;
            const createdGame = await this._prisma.game_table.create({ data });
            return createdGame;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Game already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async update(id, updateGameDto) {
        try {
            const updatedRecord = await this._prisma.game_table.update({
                where: {
                    id,
                },
                data: updateGameDto,
            });
            return updatedRecord;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Game with ID ${id} not found.`);
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamesService);
//# sourceMappingURL=games.service.js.map