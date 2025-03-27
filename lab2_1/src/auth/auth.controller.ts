import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto.dto';
import { SignUpDto } from './dto/sign-up-dto.dto';
import { AuthResponseDto } from './dto/auth-response-dto.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) : Promise<AuthResponseDto>{
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) : Promise<AuthResponseDto>{
    return this.authService.signIn(signInDto);
  }
}
