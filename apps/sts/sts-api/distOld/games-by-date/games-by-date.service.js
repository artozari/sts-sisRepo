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
exports.GamesByDateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GamesByDateService = class GamesByDateService {
    constructor(_prismaService) {
        this._prismaService = _prismaService;
    }
    create(createGamesByDateDto) {
        return ('This action adds a new gamesByDate with the following data: ' +
            JSON.stringify(createGamesByDateDto));
    }
    findAll() {
        return `This action returns all gamesByDate`;
    }
    findByDate(dateIni, dateEnd) {
        const inicio = new Date(`${dateIni}T00:00:00.000`);
        const fin = new Date(`${dateEnd}T23:59:59.999`);
        return this._prismaService.game_table.findMany({
            where: {
                createdAt: {
                    gte: inicio,
                    lte: fin,
                },
            },
        });
    }
    findOne(id) {
        return `This action returns a #${id} gamesByDate`;
    }
    update(id, updateGamesByDateDto) {
        return (`This action updates a #${id} gamesByDate with the following data: ` +
            JSON.stringify(updateGamesByDateDto));
    }
    remove(id) {
        return `This action removes a #${id} gamesByDate`;
    }
};
exports.GamesByDateService = GamesByDateService;
exports.GamesByDateService = GamesByDateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamesByDateService);
//# sourceMappingURL=games-by-date.service.js.map