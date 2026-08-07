import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [PrismaModule],
  exports: [GamesModule]
})
export class GamesModule {}
