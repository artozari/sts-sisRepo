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
exports.CutoffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CutoffService = class CutoffService {
    constructor(_prismaService) {
        this._prismaService = _prismaService;
    }
    create(createCutoffDto) {
        return this._prismaService.cutoff_table.create({
            data: createCutoffDto,
        });
    }
    findAll() {
        return this._prismaService.cutoff_table.findMany();
    }
    findLastCutoff() {
        return Promise.all([
            this._prismaService.cutoff_table.findFirst({
                where: { enable: true },
                orderBy: { create_at: 'desc' },
            }),
            this._prismaService.cutoff_table.findFirst({
                where: { enable: false },
                orderBy: { create_at: 'desc' },
            }),
        ]).then(([enabledLast, disabledLast]) => ({
            enabled: enabledLast,
            disabled: disabledLast,
        }));
    }
    findOne(id) {
        return this._prismaService.cutoff_table.findUnique({
            where: { id },
        });
    }
    update(id, updateCutoffDto) {
        if (id && updateCutoffDto) {
            return this._prismaService.cutoff_table.update({
                where: { id },
                data: updateCutoffDto,
            });
        }
        else {
            return { error: 'ID o datos de actualización no proporcionados' };
        }
    }
    remove(id) {
        return `This action removes a #${id} cutoff`;
    }
};
exports.CutoffService = CutoffService;
exports.CutoffService = CutoffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CutoffService);
//# sourceMappingURL=cutoff.service.js.map