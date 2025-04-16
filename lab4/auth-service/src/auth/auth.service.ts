import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto) : Promise<AuthResponseDto> {
    const { username, email, password } = signUpDto;

    const existingUser = await this.prisma.player.findFirst({
      where: {
        OR: [
              { email: email },
              { username: username }
            ]
      }
    });

    if (existingUser) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User with this email or username already exists',
      });
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
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Incorrect password',
      });
    }

    const token = this.generateJwt(user.id);

    return { username: user.username, email: user.email, token };
  }

  private generateJwt(userId: number) {
    return this.jwtService.sign({ userId }, { secret: this.configService.get<string>('jwtSecret'), expiresIn: '1h' });
  }
}