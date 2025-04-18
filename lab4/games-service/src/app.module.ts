import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [GamesModule, PrismaModule]
})
export class AppModule {}
