import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CutoffService } from './cutoff.service';
import { CreateCutoffDto } from './dto/create-cutoff.dto';
import { UpdateCutoffDto } from './dto/update-cutoff.dto';

@Controller('cutoff')
export class CutoffController {
  constructor(private readonly cutoffService: CutoffService) {}

  @Post()
  create(@Body() createCutoffDto: CreateCutoffDto) {
    return this.cutoffService.create(createCutoffDto);
  }

  @Get()
  findAll() {
    return this.cutoffService.findAll();
  }

  @Get('last')
  findLastCutoff() {
    return this.cutoffService.findLastCutoff();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutoffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCutoffDto: UpdateCutoffDto) {
    return this.cutoffService.update(+id, updateCutoffDto);
  }

  @Patch(':id/add-key')
  addKey(@Param('id') id: string, @Body() body: UpdateCutoffDto) {
    if (body && id) {
      return this.cutoffService.update(+id, body);
    } else {
      return { error: 'Clave o ID no proporcionados' };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cutoffService.remove(+id);
  }
}
