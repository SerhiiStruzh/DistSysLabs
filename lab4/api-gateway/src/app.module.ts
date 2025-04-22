import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { LibraryModule } from './library/library.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [AuthModule, PlayersModule, GamesModule, LibraryModule, RatingsModule],
  // imports: [AuthModule, PlayersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
