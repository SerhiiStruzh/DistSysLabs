import { Module } from '@nestjs/common';
import { TechnicalTasksService } from './technical-tasks.service';
import { TechnicalTasksController } from './technical-tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TechnicalTasksService],
  controllers: [TechnicalTasksController]
})
export class TechnicalTasksModule {}
