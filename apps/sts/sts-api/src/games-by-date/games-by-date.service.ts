import { Injectable } from '@nestjs/common';
import { CreateGamesByDateDto } from './dto/create-games-by-date.dto';
import { UpdateGamesByDateDto } from './dto/update-games-by-date.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesByDateService {
  constructor(private readonly _prismaService: PrismaService) {}

  create(createGamesByDateDto: CreateGamesByDateDto) {
    return (
      'This action adds a new gamesByDate with the following data: ' +
      JSON.stringify(createGamesByDateDto)
    );
  }

  findAll() {
    return `This action returns all gamesByDate`;
  }

  findByDate(dateIni: string, dateEnd: string) {
    const inicio = new Date(`${dateIni}T00:00:00.000`);
    const fin = new Date(`${dateEnd}T23:59:59.999`);

    return this._prismaService.game_table.findMany({
      where: {
        createdAt: {
          gte: inicio,
          lte: fin,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} gamesByDate`;
  }

  update(id: number, updateGamesByDateDto: UpdateGamesByDateDto) {
    return (
      `This action updates a #${id} gamesByDate with the following data: ` +
      JSON.stringify(updateGamesByDateDto)
    );
  }

  remove(id: number) {
    return `This action removes a #${id} gamesByDate`;
  }
}
