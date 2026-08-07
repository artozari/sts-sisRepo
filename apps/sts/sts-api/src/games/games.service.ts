import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnableGameDto } from './dto/enable-game.dto';
import { GameInterface } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(private _prisma: PrismaService) {}

  /**
   * Creates a new game using the provided data.
   *
   * @param {CreateGameDto} createGameDto - The data for creating a new game.
   * @return {Promise<Game_table>} A Promise that resolves to the created game.
   * @throws {ConflictException} If a game with the same data already exists.
   * @throws {InternalServerErrorException} If there is an internal server error.
   */
  async create(createGameDto: CreateGameDto): Promise<CreateGameDto> {
    try {
      const data = createGameDto;
      const createdGame = await this._prisma.game_table.create({ data });
      return createdGame;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Game already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  findAll = async (
    q: number,
    table: number,
    enabledQuery: string,
  ): Promise<GameInterface[]> => {
    const tableId: number | undefined =
      isNaN(table) === false ? table : undefined;

    let enabled: boolean | undefined;
    if (enabledQuery === undefined) enabled = undefined;
    else if (enabledQuery.toLowerCase() === 'true') enabled = true;
    else if (enabledQuery.toLowerCase() === 'false') enabled = false;
    else enabled = undefined;

    const foundMany: GameInterface[] = await this._prisma.game_table.findMany({
      where: { tableId, enabled },
      orderBy: { id: 'desc' },
      take: isNaN(q) === false ? q : undefined,
    });
    if (foundMany.length === 0) {
      throw new NotFoundException('Games not found');
    }
    return foundMany;
  };

  public findOne = async (id: number) => {
    const foundOne = await this._prisma.game_table.findUnique({
      where: { id },
    });
    if (!foundOne) {
      throw new NotFoundException(`Game with ID ${id} not found.`);
    }
    return foundOne;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateGameDto: UpdateGameDto) {
    try {
      const updatedRecord = await this._prisma.game_table.update({
        where: {
          id,
        },
        data: updateGameDto,
      });
      return updatedRecord;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Game with ID ${id} not found.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //   remove(id: number) {
  //     return `This action removes a #${id} game`;
  //   }

  public enabled = async (id: number, enableGameDto: EnableGameDto) => {
    const enabledRecord: boolean = enableGameDto.enabled;
    return await this._prisma.game_table.update({
      where: {
        id,
      },
      data: {
        enabled: enabledRecord,
      },
    });
  };
}
