import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CasinoService } from './casino.service';
import { CreateCasinoDto } from './dto/create-casino.dto';
import { UpdateCasinoDto } from './dto/update-casino.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Casino')
@Controller({
  path: 'casino',
  version: '1',
})
export class CasinoController {
  constructor(private readonly casinoService: CasinoService) {}

  @ApiOperation({ summary: 'Creates a new casino.' })
  @ApiResponse({ status: 201, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Duplicate entry.' })
  @Post()
  create(@Body() createCasinoDto: CreateCasinoDto) {
    return this.casinoService.create(createCasinoDto);
  }

  @ApiOperation({ summary: 'Get all casinos.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Quantity of results to return',
    required: false,
  })
  @Get()
  findAll(@Query('q') q: string) {
    return this.casinoService.findAll(+q);
  }

  @ApiOperation({ summary: 'Get a single casino.' })
  @ApiParam({ name: 'id', type: String, description: 'Casino ID', required: true })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casinoService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a casino.' })
  @ApiParam({ name: 'id', type: String, description: 'Casino ID', required: true })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Casino not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCasinoDto: UpdateCasinoDto) {
    return this.casinoService.update(+id, updateCasinoDto);
  }

  @ApiOperation({ summary: 'Delete a casino.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Casino not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casinoService.remove(+id);
  }
}
