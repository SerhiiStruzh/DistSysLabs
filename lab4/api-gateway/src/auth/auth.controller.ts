import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

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
