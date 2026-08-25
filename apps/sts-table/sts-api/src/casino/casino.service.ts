import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCasinoDto } from './dto/create-casino.dto';
import { UpdateCasinoDto } from './dto/update-casino.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CasinoEntityInterface } from './entities/casino.entity';
import { LocalCacheService } from 'src/local-cache/local-cache.service';

@Injectable()
export class CasinoService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _cache: LocalCacheService,
  ) {}

  public create(createCasinoDto: CreateCasinoDto) {
    const data = createCasinoDto;
    const createdElement = this._prisma.casino_table.create({ data });
    return createdElement;
  }
  catch(error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Game already exists');
    } else {
      throw new InternalServerErrorException();
    }
  }

  async findAll(q: number): Promise<CasinoEntityInterface[]> {
    try {
      const foundMany: CasinoEntityInterface[] =
        await this._prisma.casino_table.findMany({
          orderBy: { id: 'desc' },
          take: isNaN(q) === false ? q : undefined,
        });
      if (foundMany.length === 0) {
        throw new NotFoundException('Casinos not found');
      }
      return foundMany;
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal Server Error while finding all Casinos.`,
      );
    }
  }

  async findOne(id: number): Promise<CasinoEntityInterface> {
    try {
      const foundOne: CasinoEntityInterface[] =
        (await this._prisma.casino_table.findMany({
          where: { id },
          orderBy: { id: 'desc' },
          take: 1,
        })) as CasinoEntityInterface[];
      if (foundOne.length === 0) {
        throw new NotFoundException(`Casino with ID ${id} not found.`);
      }
      return foundOne[0];
    } catch (error) {
      // If the error is a NotFoundException, we relaunch it
      if (error instanceof NotFoundException) {
        throw error;
      }
      // For other errors, we launch an InternalServerErrorException
      throw new InternalServerErrorException(
        `Internal Server Error while finding Casino with ID ${id}.`,
      );
    }
  }

  async update(id: number, updateCasinoDto: UpdateCasinoDto) {
    try {
      const updatedRecord = await this._prisma.casino_table.update({
        where: {
          id,
        },
        data: updateCasinoDto,
      });
      return updatedRecord;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Casino with ID ${id} not found.`);
      } else {
        throw new InternalServerErrorException(
          `Internal Server Error while updating Casino with ID ${id}.`,
        );
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} casino`;
  }
}
