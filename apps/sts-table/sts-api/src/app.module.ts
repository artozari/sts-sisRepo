import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { TableModule } from './table/table.module';
import { PingModule } from './ping/ping.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { CasinoModule } from './casino/casino.module';
import { LocalCacheModule } from './local-cache/local-cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GamesByDateModule } from './games-by-date/games-by-date.module';
import { CutoffModule } from './cutoff/cutoff.module';

@Module({
  imports: [
    GamesModule,
    TableModule,
    PingModule,
    ConfigurationModule,
    CasinoModule,
    CacheModule.register(),
    LocalCacheModule,
    UsersModule,
    ProfilesModule,
    GamesByDateModule,
    CutoffModule,
  ],
  controllers: [],
  providers: [],
  exports: [CacheModule],
})
export class AppModule {}
