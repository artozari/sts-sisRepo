import { Injectable } from '@nestjs/common';
import { CreateCutoffDto } from './dto/create-cutoff.dto';
import { UpdateCutoffDto } from './dto/update-cutoff.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CutoffService {
  constructor(private readonly _prismaService: PrismaService) {}

  create(createCutoffDto: CreateCutoffDto) {
    return this._prismaService.cutoff_table.create({
      data: createCutoffDto,
    });
  }

  findAll() {
    return this._prismaService.cutoff_table.findMany();
  }

  findLastCutoff() {
    return Promise.all([
      this._prismaService.cutoff_table.findFirst({
        where: { enable: true },
        orderBy: { create_at: 'desc' },
      }),
      this._prismaService.cutoff_table.findFirst({
        where: { enable: false },
        orderBy: { create_at: 'desc' },
      }),
    ]).then(([enabledLast, disabledLast]) => ({
      enabled: enabledLast,
      disabled: disabledLast,
    }));
  }

  findOne(id: number) {
    return this._prismaService.cutoff_table.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCutoffDto: UpdateCutoffDto) {
    if (id && updateCutoffDto) {
      return this._prismaService.cutoff_table.update({
        where: { id },
        data: updateCutoffDto,
      });
    } else {
      return { error: 'ID o datos de actualización no proporcionados' };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cutoff`;
  }
}
