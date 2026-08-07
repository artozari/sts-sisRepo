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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    constructor(_prisma) {
        this._prisma = _prisma;
        this.create = async (createProfileDto) => {
            let data;
            let createdProfile;
            try {
                data = createProfileDto;
                createdProfile = await this._prisma.profile_table.create({ data });
                common_1.Logger.log(`create(): ${data.userId}`, 'ProfilesService');
                return createdProfile;
            }
            catch (error) {
                common_1.Logger.error(`create(): ${error.code}`, 'ProfilesService');
                if (error.code === 'P2002')
                    throw new common_1.ConflictException(`The profile for the user with id ${data.userId} already exists`);
                else if (error.code === 'P2003')
                    throw new common_1.ConflictException(`User with id ${data.userId} does not exist`);
                else {
                    throw new common_1.BadRequestException('An error occurred while creating the Profile.');
                }
            }
        };
        this.findAll = async () => {
            const foundMany = await this._prisma.profile_table.findMany({
                orderBy: { id: 'desc' },
            });
            if (foundMany.length === 0) {
                throw new common_1.NotFoundException('Profile not found');
            }
            return foundMany;
        };
        this.findOne = async (id) => {
            const foundOne = await this._prisma.profile_table.findUnique({
                where: { id },
            });
            if (!foundOne) {
                throw new common_1.NotFoundException(`Profile with ID ${id} not found.`);
            }
            return foundOne;
        };
        this.update = async (id, updateUserDto) => {
            try {
                const updatedRecord = await this._prisma.profile_table.update({
                    where: {
                        id,
                    },
                    data: updateUserDto,
                });
                common_1.Logger.log(`update(): ${id}`, 'ProfilesService');
                return updatedRecord;
            }
            catch (error) {
                common_1.Logger.error(`update(): ${error.code}`, 'ProfilesService');
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Profile with ID ${id} not found.`);
                }
                else if (error.code === 'P2003') {
                    throw new common_1.NotFoundException(`The profile for user with id ${id} has an invalid foreign key.`);
                }
                else {
                    throw new common_1.InternalServerErrorException();
                }
            }
        };
    }
    remove(id) {
        return `This action removes a #${id} profile`;
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map