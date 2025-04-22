import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';


@Injectable()
export class LibraryService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async addGameToLibrary(
    userId: number,
    gameLibraryDto: AddGameToLibraryDto,
  ): Promise<GameResponseDto> {
    const { gameId } = gameLibraryDto;

    let gameData: any = null;
    try {
      gameData = await firstValueFrom(
        this.httpService.get(`http://api-gateway:3000/games/${gameId}`),
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Game with ID ${gameId} not found`,
        });
      }
      throw error;
    }

    const game = gameData.data;

    if (!game) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Game with ID ${gameId} not found`,
      });
    }

    const existingPlayerGame = await this.prisma.playerGame.findUnique({
      where: {
        playerId_gameId: {
          playerId: userId,
          gameId: gameId,
        },
      },
    });

    if (existingPlayerGame) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'This game is already in your library',
      });
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

  async removeGameFromLibrary(userId: number, gameId: number): Promise<boolean> {
    const playerGame = await this.prisma.playerGame.findUnique({
      where: {
        playerId_gameId: {
          playerId: userId,
          gameId: gameId,
        },
      },
    });

    if (!playerGame) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Game with ID ${gameId} is not in your library`,
      });
    }

    try{
      await this.prisma.playerGame.delete({
        where: {
          id: playerGame.id,
        },
      });
      return true;
    } catch(error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Internal Server Error`,
      });
    }
  }

  async getGamesInLibrary(userId: number): Promise<GameResponseDto[]> {
    const playerGamesInfo = await this.prisma.playerGame.findMany({
      where: { playerId: userId },
    });

    const gameIds = playerGamesInfo.map(info => info.gameId);
    if(gameIds.length === 0) {
      return [];
    }

    let gamesData: any = null;
    try {
      gamesData = await firstValueFrom(
        this.httpService.post(`http://api-gateway:3000/games/by-ids`, {ids: gameIds}),
      );
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Internal Server Error`,
      });
    }

    const playerGames = gamesData.data[0];

    return playerGames.map((playerGame) => ({
      id: playerGame.id,
      title: playerGame.title,
      genre: playerGame.genre,
      platforms: playerGame.platforms,
      releaseDate: playerGame.releaseDate ? playerGame.releaseDate : undefined,
      description: playerGame.description ? playerGame.description : undefined,
    }));
  }
}
