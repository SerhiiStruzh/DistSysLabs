import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TechnicalTasksModule } from './technical-tasks/technical-tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
            PrismaModule, 
            UsersModule, 
            TechnicalTasksModule, 
            ProjectsModule, InvoicesModule
           ]
})
export class AppModule {}
