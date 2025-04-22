import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'RATINGS_SERVICE',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3005
      }
    }])
  ],
  providers: [RatingsService],
  controllers: [RatingsController]
})
export class RatingsModule {}
