import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntityInterface } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  private _salt: string;

  constructor(private readonly _prisma: PrismaService) {}

  private readonly stringToEncrypt = (
    p_email: string,
    p_password: string,
  ): string => {
    try {
      const str: string = p_email + '___' + p_password;
      return str;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  };

  private readonly deleteUserFields = (
    p_user: UserEntityInterface,
  ): unknown => {
    delete p_user.password;
    delete p_user.id;

    return p_user;
  };

  async onModuleInit() {
    this._salt = await bcrypt.genSalt(12);
  }

  create = async (createUserDto: CreateUserDto) => {
    let createdUser: UserEntityInterface;
    try {
      const data = createUserDto;

      const newPassword: string = this.stringToEncrypt(
        data.email,
        data.password,
      );
      data.password = await bcrypt.hash(newPassword, this._salt);

      createdUser = await this._prisma.user_table.create({ data });
      Logger.log(`create(): ${data.email}`, 'UsersService');
      const u = this.deleteUserFields(createdUser);
      return u;
    } catch (error) {
      //empty
      Logger.error(`create(): ${error.code}`, 'UsersService');
      if (createdUser === undefined) {
        throw new ConflictException('User already exists');
      } else {
        throw new BadRequestException(
          'An error occurred while creating the user.',
        );
      }
    }
  };

  findAll = async (): Promise<unknown[]> => {
    const foundMany: UserEntityInterface[] =
      await this._prisma.user_table.findMany({
        orderBy: { id: 'desc' },
      });
    if (foundMany.length === 0) {
      throw new NotFoundException('Users not found');
    }
    const lotOfU: unknown[] = [];
    for (const u of foundMany) {
      lotOfU.push(this.deleteUserFields(u));
    }
    return lotOfU;
  };

  findOne = async (id: number) => {
    if (isNaN(id)) {
      const message: string = `ID must be a number`;
      Logger.error(`findOne(): ${message}`, 'UsersService');
      throw new BadRequestException(message);
    }
    const foundOne = await this._prisma.user_table.findUnique({
      where: { id },
    });
    if (!foundOne) {
      const message: string = `User with ID "${id}" not found`;
      Logger.error(`findOne(): ${message}`, 'UsersService');
      throw new NotFoundException(message);
    }
    const u = this.deleteUserFields(foundOne);
    return u;
  };

  private readonly setNewPasswordById = async (
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> => {
    if (updateUserDto.password) {
      let email: string = '';
      if (updateUserDto.email) email = updateUserDto.email;
      else {
        const foundOne = await this.findOne(id);
        if (foundOne && typeof foundOne === 'object') {
          if ((foundOne as UserEntityInterface).email !== undefined)
            email = (foundOne as UserEntityInterface).email;
        }
      }

      // check if email exists
      if (email !== '') {
        const newPassword: string = this.stringToEncrypt(
          email,
          updateUserDto.password,
        );

        updateUserDto.password = await bcrypt.hash(newPassword, this._salt);
      } else throw new NotFoundException('User with ID ${id} not found.');
    }

    return updateUserDto;
  };

  update = async (id: number, updateUserDto: UpdateUserDto) => {
    try {
      updateUserDto = await this.setNewPasswordById(id, updateUserDto);

      const updatedRecord = await this._prisma.user_table.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
      Logger.log(`update(): ${updatedRecord.email}`, 'UsersService');
      const u = this.deleteUserFields(updatedRecord);
      return u;
    } catch (error) {
      Logger.error(`update(${id}): ${error.code}`, 'UsersService');
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found.`);
      } else if (error.code === 'P2003') {
        throw new NotFoundException(`Invalid foreing key.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  };

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findOneByEmail = async (email) => {
    try {
      const user = await this._prisma.user_table.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        const message = `${email} not found`;
        throw new NotFoundException(message);
      }

      const u = this.deleteUserFields(user);
      return u;
    } catch (error) {
      Logger.error(
        `findUserByEmail(): ${error.code} by ${email}`,
        'UsersService',
      );
      throw error;
    }
  };

  private readonly setNewPasswordByEmail = async (
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> => {
    if (updateUserDto.password) {
      if (updateUserDto.email) email = updateUserDto.email;

      // check if email exists
      if (email !== '') {
        const newPassword: string = this.stringToEncrypt(
          email,
          updateUserDto.password,
        );

        updateUserDto.password = await bcrypt.hash(newPassword, this._salt);
      } else throw new NotFoundException('User with ID ${id} not found.');
    }

    return updateUserDto;
  };

  updateByEmail = async (email: string, updateUserDto: UpdateUserDto) => {
    try {
      updateUserDto = await this.setNewPasswordByEmail(email, updateUserDto);

      const updatedRecord = await this._prisma.user_table.update({
        where: {
          email,
        },
        data: updateUserDto,
      });
      Logger.log(`updateByEmail(): ${email}`, 'UsersService');
      const u = this.deleteUserFields(updatedRecord);
      return u;
    } catch (error) {
      Logger.error(`updateByEmail(${email}): ${error.code}`, 'UsersService');
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `User with ID ${email} not found.`,
        );
      } else if (error.code === 'P2003') {
        throw new NotFoundException(`Invalid foreing key.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  };
}
