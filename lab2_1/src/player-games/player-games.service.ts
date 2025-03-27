import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameResponseDto } from 'src/games/dto/response-game.dto';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';

@Injectable()
export class PlayerGamesService {
  constructor(private prisma: PrismaService) {}

  async addGameToLibrary(
    userId: number,
    gameLibraryDto: AddGameToLibraryDto,
  ): Promise<GameResponseDto> {
    const { gameId } = gameLibraryDto;

    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    const existingPlayerGame = await this.prisma.playerGame.findUnique({
      where: {
        playerId_gameId: {
          playerId: userId,
          gameId,
        },
      },
    });

    if (existingPlayerGame) {
      throw new Error('This game is already in your library');
    }

    const playerGame = await this.prisma.playerGame.create({
      data: {
        playerId: userId,
        gameId,
      },
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

  async removeGameFromLibrary(userId: number, gameId: number): Promise<void> {
    const playerGame = await this.prisma.playerGame.findUnique({
      where: {
        playerId_gameId: {
          playerId: userId,
          gameId,
        },
      },
    });

    if (!playerGame) {
      throw new NotFoundException(`Game with ID ${gameId} is not in your library`);
    }

    await this.prisma.playerGame.delete({
      where: {
        id: playerGame.id,
      },
    });
  }

  async getGamesInLibrary(userId: number): Promise<GameResponseDto[]> {
    const playerGames = await this.prisma.playerGame.findMany({
      where: { playerId: userId },
      include: {
        game: true,
      },
    });

    return playerGames.map((playerGame) => ({
      id: playerGame.game.id,
      title: playerGame.game.title,
      genre: playerGame.game.genre,
      platforms: playerGame.game.platforms,
      releaseDate: playerGame.game.releaseDate ? playerGame.game.releaseDate : undefined,
      description: playerGame.game.description ? playerGame.game.description : undefined,
    }));
  }
}
