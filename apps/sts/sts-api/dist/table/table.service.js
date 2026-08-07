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
exports.TableService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TableService = class TableService {
    constructor(_prisma) {
        this._prisma = _prisma;
        this.update = async (id, updateTableDto) => {
            try {
                const updatedRecord = await this._prisma.table_table.update({
                    where: {
                        id,
                    },
                    data: updateTableDto,
                });
                return updatedRecord;
            }
            catch (error) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Table already exists');
                }
                else {
                    throw new common_1.InternalServerErrorException();
                }
            }
        };
        this.enabled = async (id, enableTableDto) => {
            const enabledTable = enableTableDto.enabled;
            return await this._prisma.table_table.update({
                where: {
                    id
                },
                data: {
                    enabled: enabledTable
                }
            });
        };
    }
    async create(createTableDto) {
        try {
            const data = createTableDto;
            const table = await this._prisma.table_table.create({ data });
            return table;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Table already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async findAll() {
        const foundMany = await this._prisma.table_table.findMany();
        if (foundMany.length === 0) {
            throw new common_1.NotFoundException('Tables not found');
        }
        return foundMany;
    }
    async findOne(id) {
        const foundOne = await this._prisma.table_table.findUnique({ where: { id } });
        if (!foundOne) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found.`);
        }
        return foundOne;
    }
    async findOneByKey(key) {
        const foundOne = await this._prisma.table_table.findUnique({ where: { key, enabled: true } });
        if (!foundOne) {
            throw new common_1.NotFoundException(`Table with KEY ${key} not found.`);
        }
        return foundOne;
    }
};
exports.TableService = TableService;
exports.TableService = TableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TableService);
//# sourceMappingURL=table.service.js.map