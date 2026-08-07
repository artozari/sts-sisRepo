import { Module } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { CasinoController } from './casino.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LocalCacheModule } from 'src/local-cache/local-cache.module';

@Module({
  controllers: [CasinoController],
  providers: [CasinoService],
  imports: [PrismaModule, LocalCacheModule],
  exports: [CasinoModule],
})
export class CasinoModule {}
