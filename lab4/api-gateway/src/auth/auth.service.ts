import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy
  ) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async signUp(signUpDto: SignUpDto) : Promise<AuthResponseDto> {
    return await firstValueFrom(
      this.authClient.send<AuthResponseDto>('auth.sign-up', signUpDto)
    );
  }

  async signIn(signInDto: SignInDto) : Promise<AuthResponseDto> {
    return await firstValueFrom(
      this.authClient.send<AuthResponseDto>('auth.sign-in', signInDto)
    );
  }
}
