import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(private readonly _prisma: PrismaService) {}

  create = async (createProfileDto: CreateProfileDto) => {
    let data: CreateProfileDto;
    let createdProfile: ProfileEntity;
    try {
      data = createProfileDto;
      createdProfile = await this._prisma.profile_table.create({ data });
      Logger.log(`create(): ${data.userId}`, 'ProfilesService');
      return createdProfile;
    } catch (error) {
      //empty
      Logger.error(`create(): ${error.code}`, 'ProfilesService');
      if (error.code === 'P2002')
        throw new ConflictException(`The profile for the user with id ${data.userId} already exists`);
      else if (error.code === 'P2003')
        throw new ConflictException(
          `User with id ${data.userId} does not exist`,
        );
      else {
        throw new BadRequestException(
          'An error occurred while creating the Profile.',
        );
      }
    }
  };

  findAll = async (): Promise<ProfileEntity[]> => {
    const foundMany: ProfileEntity[] =
      await this._prisma.profile_table.findMany({
        orderBy: { id: 'desc' },
      });
    if (foundMany.length === 0) {
      throw new NotFoundException('Profile not found');
    }
    return foundMany;
  };

  findOne = async (id: number) => {
    const foundOne = await this._prisma.profile_table.findUnique({
      where: { id },
    });
    if (!foundOne) {
      throw new NotFoundException(`Profile with ID ${id} not found.`);
    }
    return foundOne;
  };

  update = async (id: number, updateUserDto: UpdateProfileDto) => {
    try {
      const updatedRecord = await this._prisma.profile_table.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
      Logger.log(`update(): ${id}`, 'ProfilesService');
      return updatedRecord;
    } catch (error) {
      Logger.error(`update(): ${error.code}`, 'ProfilesService');
      if (error.code === 'P2025') {
        throw new NotFoundException(`Profile with ID ${id} not found.`);
      } else if (error.code === 'P2003') {
        throw new NotFoundException(`The profile for user with id ${id} has an invalid foreign key.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  };

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
