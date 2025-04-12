import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';

@Module({
  imports: [
            ConfigModule.forRoot({
              load: [configuration]
            }),
            PrismaModule,
            JwtModule.register({})
           ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
