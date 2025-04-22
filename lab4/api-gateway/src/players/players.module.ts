import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PLAYERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'players-service',
          port: 3002,
        },
      },
    ]),
  ],
  providers: [PlayersService],
  controllers: [PlayersController]
})
export class PlayersModule {}
