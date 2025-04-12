import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.sign-in')
  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(signInDto);
  }

  @MessagePattern('auth.sign-up')
  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(signUpDto);
  }
}
