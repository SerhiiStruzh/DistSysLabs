import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../config/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
            ConfigModule.forRoot({
              load: [configuration]
            }),
            ClientsModule.register([
              {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                  host: 'localhost',
                  port: 3001,
                },
              },
            ]),
            JwtModule.register({})
           ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
