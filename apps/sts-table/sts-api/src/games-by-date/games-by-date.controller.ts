import { Controller, Get, Param } from '@nestjs/common';
import { GamesByDateService } from './games-by-date.service';

@Controller('games-by-date')
export class GamesByDateController {
  constructor(private readonly gamesByDateService: GamesByDateService) {}

  @Get(':dateIni/:dateEnd')
  findByDate(
    @Param('dateIni') dateIni: string,
    @Param('dateEnd') dateEnd: string,
  ) {
    return this.gamesByDateService.findByDate(dateIni, dateEnd);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesByDateService.findOne(id as unknown as number);
  }
}
