import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnableTableDto } from './dto/enable-table.dto';

@ApiTags('Table')
@Controller({
	path: 'table',
	version: '1',
  })
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @ApiOperation({ summary: 'Create a Table' })
  @ApiResponse({ status: 201, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Duplicate entry.' })
  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @ApiOperation({ summary: 'Get all Tables' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Tables not found.' })
  @Get()
  findAll() {
    return this.tableService.findAll();
  }

  @ApiOperation({ summary: 'Get a Table' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(+id);
  }

  @ApiOperation({ summary: 'Get a Table by key' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  @Get('key/:key')
  findOneByKey(@Param('key') key: string) {
    return this.tableService.findOneByKey(key);
  }

  @ApiOperation({ summary: 'Update a Table' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(+id, updateTableDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tableService.remove(+id);
  // }

  @ApiOperation({ summary: 'Enable or disable a Table' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Table not found.' })
  @Patch('enable/:id')
  enable(@Param('id') id: string, @Body() enableTableDto: EnableTableDto) {
    return this.tableService.enabled(+id, enableTableDto);
  }
}
