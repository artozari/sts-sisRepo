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
exports.UsersService = void 0;
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(_prisma) {
        this._prisma = _prisma;
        this.stringToEncrypt = (p_email, p_password) => {
            try {
                const str = p_email + '___' + p_password;
                return str;
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        };
        this.deleteUserFields = (p_user) => {
            delete p_user.password;
            delete p_user.id;
            return p_user;
        };
        this.create = async (createUserDto) => {
            let createdUser;
            try {
                const data = createUserDto;
                const newPassword = this.stringToEncrypt(data.email, data.password);
                data.password = await bcrypt.hash(newPassword, this._salt);
                createdUser = await this._prisma.user_table.create({ data });
                common_1.Logger.log(`create(): ${data.email}`, 'UsersService');
                const u = this.deleteUserFields(createdUser);
                return u;
            }
            catch (error) {
                common_1.Logger.error(`create(): ${error.code}`, 'UsersService');
                if (createdUser === undefined) {
                    throw new common_1.ConflictException('User already exists');
                }
                else {
                    throw new common_1.BadRequestException('An error occurred while creating the user.');
                }
            }
        };
        this.findAll = async () => {
            const foundMany = await this._prisma.user_table.findMany({
                orderBy: { id: 'desc' },
            });
            if (foundMany.length === 0) {
                throw new common_1.NotFoundException('Users not found');
            }
            const lotOfU = [];
            for (const u of foundMany) {
                lotOfU.push(this.deleteUserFields(u));
            }
            return lotOfU;
        };
        this.findOne = async (id) => {
            if (isNaN(id)) {
                const message = `ID must be a number`;
                common_1.Logger.error(`findOne(): ${message}`, 'UsersService');
                throw new common_1.BadRequestException(message);
            }
            const foundOne = await this._prisma.user_table.findUnique({
                where: { id },
            });
            if (!foundOne) {
                const message = `User with ID "${id}" not found`;
                common_1.Logger.error(`findOne(): ${message}`, 'UsersService');
                throw new common_1.NotFoundException(message);
            }
            const u = this.deleteUserFields(foundOne);
            return u;
        };
        this.setNewPasswordById = async (id, updateUserDto) => {
            if (updateUserDto.password) {
                let email = '';
                if (updateUserDto.email)
                    email = updateUserDto.email;
                else {
                    const foundOne = await this.findOne(id);
                    if (foundOne && typeof foundOne === 'object') {
                        if (foundOne.email !== undefined)
                            email = foundOne.email;
                    }
                }
                if (email !== '') {
                    const newPassword = this.stringToEncrypt(email, updateUserDto.password);
                    updateUserDto.password = await bcrypt.hash(newPassword, this._salt);
                }
                else
                    throw new common_1.NotFoundException('User with ID ${id} not found.');
            }
            return updateUserDto;
        };
        this.update = async (id, updateUserDto) => {
            try {
                updateUserDto = await this.setNewPasswordById(id, updateUserDto);
                const updatedRecord = await this._prisma.user_table.update({
                    where: {
                        id,
                    },
                    data: updateUserDto,
                });
                common_1.Logger.log(`update(): ${updatedRecord.email}`, 'UsersService');
                const u = this.deleteUserFields(updatedRecord);
                return u;
            }
            catch (error) {
                common_1.Logger.error(`update(${id}): ${error.code}`, 'UsersService');
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`User with ID ${id} not found.`);
                }
                else if (error.code === 'P2003') {
                    throw new common_1.NotFoundException(`Invalid foreing key.`);
                }
                else {
                    throw new common_1.InternalServerErrorException();
                }
            }
        };
        this.findOneByEmail = async (email) => {
            try {
                const user = await this._prisma.user_table.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user) {
                    const message = `${email} not found`;
                    throw new common_1.NotFoundException(message);
                }
                const u = this.deleteUserFields(user);
                return u;
            }
            catch (error) {
                common_1.Logger.error(`findUserByEmail(): ${error.code} by ${email}`, 'UsersService');
                throw error;
            }
        };
        this.setNewPasswordByEmail = async (email, updateUserDto) => {
            if (updateUserDto.password) {
                if (updateUserDto.email)
                    email = updateUserDto.email;
                if (email !== '') {
                    const newPassword = this.stringToEncrypt(email, updateUserDto.password);
                    updateUserDto.password = await bcrypt.hash(newPassword, this._salt);
                }
                else
                    throw new common_1.NotFoundException('User with ID ${id} not found.');
            }
            return updateUserDto;
        };
        this.updateByEmail = async (email, updateUserDto) => {
            try {
                updateUserDto = await this.setNewPasswordByEmail(email, updateUserDto);
                const updatedRecord = await this._prisma.user_table.update({
                    where: {
                        email,
                    },
                    data: updateUserDto,
                });
                common_1.Logger.log(`updateByEmail(): ${email}`, 'UsersService');
                const u = this.deleteUserFields(updatedRecord);
                return u;
            }
            catch (error) {
                common_1.Logger.error(`updateByEmail(${email}): ${error.code}`, 'UsersService');
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`User with ID ${email} not found.`);
                }
                else if (error.code === 'P2003') {
                    throw new common_1.NotFoundException(`Invalid foreing key.`);
                }
                else {
                    throw new common_1.InternalServerErrorException();
                }
            }
        };
    }
    async onModuleInit() {
        this._salt = await bcrypt.genSalt(12);
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map