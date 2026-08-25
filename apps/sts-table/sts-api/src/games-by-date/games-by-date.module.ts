import { Module } from '@nestjs/common';
import { GamesByDateService } from './games-by-date.service';
import { GamesByDateController } from './games-by-date.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GamesByDateController],
  providers: [GamesByDateService],
})
export class GamesByDateModule {}
