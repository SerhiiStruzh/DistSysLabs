import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerResponseDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

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
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return {
      username: player.username,
      email: player.email,
    };
  }

  async updatePlayer(
    id: number,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerResponseDto> {
    const { username, email } = updatePlayerDto;

    const existingPlayer = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!existingPlayer) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    const updatedPlayer = await this.prisma.player.update({
      where: { id },
      data: {
        username: username || existingPlayer.username,
        email: email || existingPlayer.email,
      },
    });

    return {
      username: updatedPlayer.username,
      email: updatedPlayer.email,
    };
  }
}
