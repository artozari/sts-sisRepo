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
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConfigurationService = class ConfigurationService {
    constructor(_prisma) {
        this._prisma = _prisma;
        this.findAll = async (q, config, enabledQuery) => {
            const id = isNaN(config) === false ? config : undefined;
            let enabled;
            if (enabledQuery === undefined)
                enabled = undefined;
            else if (enabledQuery.toLowerCase() === 'true')
                enabled = true;
            else if (enabledQuery.toLowerCase() === 'false')
                enabled = false;
            else
                enabled = undefined;
            const foundMany = await this._prisma.config_table.findMany({
                where: { id, enabled },
                orderBy: { id: 'desc' },
                take: isNaN(q) === false ? q : undefined,
            });
            if (foundMany.length === 0) {
                throw new common_1.NotFoundException('Configurations not found');
            }
            return foundMany;
        };
        this.findOne = async (id) => {
            const foundOne = await this._prisma.config_table.findUnique({
                where: { id },
            });
            if (!foundOne) {
                throw new common_1.NotFoundException(`Configuration with ID ${id} not found.`);
            }
            return foundOne;
        };
    }
    create(createConfigurationDto) {
        const data = createConfigurationDto;
        const createdGame = this._prisma.config_table.create({ data });
        return createdGame;
    }
    catch(error) {
        if (error.code === 'P2002') {
            throw new common_1.ConflictException('Configuration already exists');
        }
        else {
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, updateConfigurationDto) {
        try {
            const updatedRecord = await this._prisma.config_table.update({
                where: {
                    id,
                },
                data: updateConfigurationDto,
            });
            return updatedRecord;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Configuration with ID ${id} not found.`);
            }
            else if (error.code === 'P2003') {
                throw new common_1.NotFoundException(`Invalid foreing key.`);
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    remove(id) {
        return `This action removes a #${id} configuration`;
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigurationService);
//# sourceMappingURL=configuration.service.js.map