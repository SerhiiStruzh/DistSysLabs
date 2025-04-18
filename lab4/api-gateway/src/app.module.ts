import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [AuthModule, PlayersModule, GamesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
