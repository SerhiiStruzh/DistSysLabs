import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerResponseDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayers(): Promise<PlayerResponseDto[]> {
    const players = await this.prisma.player.findMany();
    
    return players.map(player => ({
      username: player.username,
      email: player.email,
    }));
  }

  async getPlayerById(id: number): Promise<PlayerResponseDto> {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });
    if (!player) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Player with ID ${id} not found`,
      })
    }

    return {
      username: player.username,
      email: player.email,
    };
  }

  async updatePlayer(updatePlayerDto: UpdatePlayerDto): Promise<PlayerResponseDto> {
    const { playerId, username, email } = updatePlayerDto;

    const existingPlayer = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!existingPlayer) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Player with ID ${playerId} not found`,
      })
    }

    try {
      const updatedPlayer = await this.prisma.player.update({
        where: { id: playerId },
        data: {
          username: username || existingPlayer.username,
          email: email || existingPlayer.email,
        },
      });

      return {
        username: updatedPlayer.username,
        email: updatedPlayer.email,
      };
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'This name or email is already taken.',
        })
      }
      throw error;
    }
  }
}
