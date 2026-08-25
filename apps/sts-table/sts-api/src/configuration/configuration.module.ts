import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  imports: [PrismaModule],
  exports: [ConfigurationModule],
})
export class ConfigurationModule {}
