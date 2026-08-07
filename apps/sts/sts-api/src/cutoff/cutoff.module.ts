import { Module } from '@nestjs/common';
import { CutoffService } from './cutoff.service';
import { CutoffController } from './cutoff.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CutoffController],
  providers: [CutoffService],
})
export class CutoffModule {}
