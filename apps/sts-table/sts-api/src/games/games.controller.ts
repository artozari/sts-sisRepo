import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnableGameDto } from './dto/enable-game.dto';

@ApiTags('Games')
@Controller({
  path: 'game',
  version: '1',
})
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Creates a new game.' })
  @ApiResponse({ status: 201, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Duplicate entry.' })
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @ApiOperation({ summary: 'Get all games.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Quantity of results to return',
    required: false,
  })
  @ApiQuery({
    name: 'table',
    type: String,
    description: 'Table identifier',
    required: false,
  })
  @ApiQuery({
    name: 'enabled',
    type: Boolean,
    description: 'Enabling the gaming table',
    required: false,
  })
  @Get()
  async findAll(
    @Query('q') q: string,
    @Query('table') table: string,
    @Query('enabled') enabled: string,
  ): Promise<unknown> {
	// console.log("q:", q, "table:", table);
    return await this.gamesService.findAll(+q, +table, enabled);
  }

  @ApiOperation({ summary: 'Get a single game.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a game.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gamesService.remove(+id);
  // }

  @ApiOperation({ summary: 'Enable or disable a game.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @Patch('enable/:id')
  enable(@Param('id') id: string, @Body() enableGameDto: EnableGameDto) {
    return this.gamesService.enabled(+id, enableGameDto);
  }
}
