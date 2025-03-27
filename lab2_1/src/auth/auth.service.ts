import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in-dto.dto';
import { SignUpDto } from './dto/sign-up-dto.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthResponseDto } from './dto/auth-response-dto.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto) : Promise<AuthResponseDto> {
    const { username, email, password } = signUpDto;

    const existingUser = await this.prisma.player.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.player.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = this.generateJwt(user.id);

    return { username: user.username, email: user.email, token };
  }

  async signIn(signInDto: SignInDto) : Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await this.prisma.player.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Невірний пароль'); 
    }

    const token = this.generateJwt(user.id);

    return { username: user.username, email: user.email, token };
  }

  private generateJwt(userId: number) {
    return this.jwtService.sign({ userId }, { secret: this.configService.get<string>('jwtSecret'), expiresIn: '1h' });
  }
}
