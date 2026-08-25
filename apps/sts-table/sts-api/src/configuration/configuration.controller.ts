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
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Configuration')
@Controller({
  path: 'configuration',
  version: '1',
})
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @ApiOperation({ summary: 'Creates a new configuration.' })
  @ApiResponse({ status: 201, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Duplicate entry.' })
  @Post()
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationService.create(createConfigurationDto);
  }

  @ApiOperation({ summary: 'Get all configurations.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Quantity of results to return',
    required: false,
  })
  @ApiQuery({
    name: 'config',
    type: String,
    description: 'Configuration identifier',
    required: false,
  })
  @ApiQuery({
    name: 'enabled',
    type: Boolean,
    description: 'Enabling the configuration table',
    required: false,
  })
  @Get()
  findAll(
    @Query('q') q: string,
    @Query('config') config: string,
    @Query('enabled') enabled: string,
  ) {
    return this.configurationService.findAll(+q, +config, enabled);
  }

  @ApiOperation({ summary: 'Get a single configuration.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a configuration.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationService.update(+id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configurationService.remove(+id);
  }
}
