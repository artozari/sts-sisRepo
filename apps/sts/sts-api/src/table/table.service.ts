import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnableTableDto } from './dto/enable-table.dto';

@Injectable()
export class TableService {
  constructor(private readonly _prisma: PrismaService) { }

  async create(createTableDto: CreateTableDto) {

    try {
      const data = createTableDto;
      const table = await this._prisma.table_table.create({ data });
      return table;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Table already exists');
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll() {
    const foundMany = await this._prisma.table_table.findMany();
    if (foundMany.length === 0) {
      throw new NotFoundException('Tables not found');
    }
    return foundMany;
  }

  async findOne(id: number) {

    const foundOne = await this._prisma.table_table.findUnique({ where: { id } });
    if (!foundOne) {
      throw new NotFoundException(`Table with ID ${id} not found.`);
    }
    return foundOne;
  }

  async findOneByKey(key: string) {

    const foundOne = await this._prisma.table_table.findUnique({ where: { key, enabled: true } });
    if (!foundOne) {
      throw new NotFoundException(`Table with KEY ${key} not found.`);
    }
    return foundOne;
  }

  public update = async (id: number, updateTableDto: UpdateTableDto) => {
    try {
      const updatedRecord = await this._prisma.table_table.update({
        where: {
          id,
        },
        data: updateTableDto,
      });
      return updatedRecord;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Table already exists');
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  };

  // remove(id: number) {
  //   return `This action removes a #${id} table`;
  // }

  public enabled = async (id: number, enableTableDto: EnableTableDto) => {
    const enabledTable: boolean = enableTableDto.enabled
    return await this._prisma.table_table.update({
      where: {
        id
      },
      data: {
        enabled: enabledTable
      }
    });
  }
}
