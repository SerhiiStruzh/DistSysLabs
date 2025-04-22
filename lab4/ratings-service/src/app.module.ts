import { Module } from '@nestjs/common';
import { RatingsModule } from './ratings/ratings.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({

  imports: [RatingsModule, PrismaModule]
})
export class AppModule {}
