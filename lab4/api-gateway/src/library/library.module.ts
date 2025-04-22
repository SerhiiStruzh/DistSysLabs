import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
        ClientsModule.register([
          {
            name: 'LIBRARY_SERVICE',
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: 3004,
            },
          },
        ]),
      ],
  providers: [LibraryService],
  controllers: [LibraryController]
})
export class LibraryModule {}
