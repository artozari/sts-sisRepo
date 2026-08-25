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
exports.CasinoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const local_cache_service_1 = require("../local-cache/local-cache.service");
let CasinoService = class CasinoService {
    constructor(_prisma, _cache) {
        this._prisma = _prisma;
        this._cache = _cache;
    }
    create(createCasinoDto) {
        const data = createCasinoDto;
        const createdElement = this._prisma.casino_table.create({ data });
        return createdElement;
    }
    catch(error) {
        if (error.code === 'P2002') {
            throw new common_1.ConflictException('Game already exists');
        }
        else {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll(q) {
        try {
            const foundMany = await this._prisma.casino_table.findMany({
                orderBy: { id: 'desc' },
                take: isNaN(q) === false ? q : undefined,
            });
            if (foundMany.length === 0) {
                throw new common_1.NotFoundException('Casinos not found');
            }
            return foundMany;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Internal Server Error while finding all Casinos.`);
        }
    }
    async findOne(id) {
        try {
            const foundOne = (await this._prisma.casino_table.findMany({
                where: { id },
                orderBy: { id: 'desc' },
                take: 1,
            }));
            if (foundOne.length === 0) {
                throw new common_1.NotFoundException(`Casino with ID ${id} not found.`);
            }
            return foundOne[0];
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Internal Server Error while finding Casino with ID ${id}.`);
        }
    }
    async update(id, updateCasinoDto) {
        try {
            const updatedRecord = await this._prisma.casino_table.update({
                where: {
                    id,
                },
                data: updateCasinoDto,
            });
            return updatedRecord;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Casino with ID ${id} not found.`);
            }
            else {
                throw new common_1.InternalServerErrorException(`Internal Server Error while updating Casino with ID ${id}.`);
            }
        }
    }
    remove(id) {
        return `This action removes a #${id} casino`;
    }
};
exports.CasinoService = CasinoService;
exports.CasinoService = CasinoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        local_cache_service_1.LocalCacheService])
], CasinoService);
//# sourceMappingURL=casino.service.js.map