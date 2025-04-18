import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
      ClientsModule.register([
                    {
                      name: 'GAMES_SERVICE',
                      transport: Transport.TCP,
                      options: {
                        host: 'localhost',
                        port: 3003,
                      },
                    },
                  ]),
    ],
  providers: [GamesService],
  controllers: [GamesController]
})
export class GamesModule {}
