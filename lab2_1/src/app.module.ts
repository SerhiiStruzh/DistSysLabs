import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { PlayerGamesModule } from './player-games/player-games.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
            PrismaModule, 
            AuthModule, 
            PlayersModule, GamesModule, PlayerGamesModule, RatingsModule,
           ]
})
export class AppModule {}
