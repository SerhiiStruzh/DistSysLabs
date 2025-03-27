import { Module } from '@nestjs/common';
import { PlayerGamesService } from './player-games.service';
import { PlayerGamesController } from './player-games.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlayerGamesService],
  controllers: [PlayerGamesController]
})
export class PlayerGamesModule {}
