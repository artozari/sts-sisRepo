import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigurationEntityInterface } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(private readonly _prisma: PrismaService) {}

  create(createConfigurationDto: CreateConfigurationDto) {
    const data = createConfigurationDto;
    const createdGame = this._prisma.config_table.create({ data });
    return createdGame;
  }
  catch(error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Configuration already exists');
    } else {
      throw new InternalServerErrorException();
    }
  }

  findAll = async (
    q: number,
    config: number,
    enabledQuery: string,
  ): Promise<ConfigurationEntityInterface[]> => {
    const id: number | undefined = isNaN(config) === false ? config : undefined;

    let enabled: boolean | undefined;
    if (enabledQuery === undefined) enabled = undefined;
    else if (enabledQuery.toLowerCase() === 'true') enabled = true;
    else if (enabledQuery.toLowerCase() === 'false') enabled = false;
    else enabled = undefined;

    const foundMany: ConfigurationEntityInterface[] =
      await this._prisma.config_table.findMany({
        where: { id, enabled },
        orderBy: { id: 'desc' },
        take: isNaN(q) === false ? q : undefined,
      });
    if (foundMany.length === 0) {
      throw new NotFoundException('Configurations not found');
    }
    return foundMany;
  };

  findOne = async (id: number) => {
    const foundOne = await this._prisma.config_table.findUnique({
      where: { id },
    });
    if (!foundOne) {
      throw new NotFoundException(`Configuration with ID ${id} not found.`);
    }
    return foundOne;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    try {
      const updatedRecord = await this._prisma.config_table.update({
        where: {
          id,
        },
        data: updateConfigurationDto,
      });
      return updatedRecord;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Configuration with ID ${id} not found.`);
      } else if (error.code === 'P2003') {
        throw new NotFoundException(`Invalid foreing key.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
