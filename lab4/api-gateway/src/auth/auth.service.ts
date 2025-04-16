import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ClientProxy} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy
  ) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<AuthResponseDto>('auth.sign-up', signUpDto)
      );
    } catch (error) {
      if(error.statusCode) {
        throw new HttpException(error.message, error.statusCode)
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(signInDto: SignInDto) : Promise<AuthResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<AuthResponseDto>('auth.sign-in', signInDto)
      );
    } catch (error) {
      if(error.statusCode) {
        throw new HttpException(error.message, error.statusCode)
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
