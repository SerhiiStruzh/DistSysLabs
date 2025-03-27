import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/response-game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async createGame(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    const game = await this.prisma.game.create({
      data: createGameDto,
    });

    return {
      id: game.id,
      title: game.title,
      genre: game.genre,
      platforms: game.platforms,
      releaseDate: game.releaseDate ? game.releaseDate : undefined,
      description: game.description ? game.description : undefined,
    };
  }

  async deleteGame(id: number): Promise<void> {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    await this.prisma.game.delete({
      where: { id },
    });
  }

  async updateGame(
    id: number,
    updateGameDto: UpdateGameDto,
  ): Promise<GameResponseDto> {
    const existingGame = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    const updatedGame = await this.prisma.game.update({
      where: { id },
      data: updateGameDto,
    });

    return {
      id: updatedGame.id,
      title: updatedGame.title,
      genre: updatedGame.genre,
      platforms: updatedGame.platforms,
      releaseDate: updatedGame.releaseDate ? updatedGame.releaseDate : undefined,
      description: updatedGame.description ? updatedGame.description : undefined,
    };
  }

  async getAllGames(): Promise<GameResponseDto[]> {
    const games = await this.prisma.game.findMany();
    
    return games.map(game => ({
      id: game.id,
      title: game.title,
      genre: game.genre,
      platforms: game.platforms,
      releaseDate: game.releaseDate ? game.releaseDate : undefined,
      description: game.description ? game.description : undefined,
    }));
  }
}
