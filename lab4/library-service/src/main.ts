import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcException, Transport } from '@nestjs/microservices';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3004,
    },
  })

  const validationPipe = new ValidationPipe({
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });

      return new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${messages.join('; ')}`
      });
    },
  });

  app.useGlobalPipes(validationPipe);

  await app.listen();
}
bootstrap();
