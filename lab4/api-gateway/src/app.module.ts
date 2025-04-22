import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { LibraryModule } from './library/library.module';
import { RatingsModule } from './ratings/ratings.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [AuthModule, 
            PlayersModule, 
            GamesModule, 
            LibraryModule, 
            RatingsModule,
            CacheModule.register({
              store: redisStore,
              host: 'redis',
              port: 6379,
              isGlobal: true,
              ttl: 60 * 1000,
              max: 100,
            }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
