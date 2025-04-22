import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, toArray } from 'rxjs';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GamesService implements OnModuleInit {
  constructor(@Inject('GAMES_SERVICE') private gamesService: ClientProxy,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    await this.gamesService.connect();
  } 

  async createGame(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    try {
        const game = await firstValueFrom(
            this.gamesService.send<GameResponseDto>('games.create', createGameDto)
        );

        await this.cacheManager.set(`game-${game.id}`, game);
        return game;
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteGame(id: number): Promise<void> {
    try {
      await this.cacheManager.del(`game-${id}`);

      await firstValueFrom(
          this.gamesService.send<GameResponseDto>('games.delete', id)
      );
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateGame(
    id: number,
    updateGameDto: UpdateGameDto,
  ): Promise<GameResponseDto> {
    try {
      const game = await firstValueFrom(
          this.gamesService.send<GameResponseDto>('games.update', {gameId: id, ...updateGameDto})
      );

      await this.cacheManager.set(`game-${id}`, game);
      return game;
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllGames(): Promise<GameResponseDto[]> {
    try {
        const games = await this.gamesService.send<GameResponseDto>('games.get-all', {}).pipe(toArray());
        return await firstValueFrom(games);
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGameById(id: number) : Promise<GameResponseDto> {
    try {
      const cachedGame = await this.cacheManager.get<GameResponseDto>(`game-${id}`);
      if(cachedGame) return cachedGame;

      const game = await firstValueFrom(
          this.gamesService.send<GameResponseDto>('games.get-by-id', id)
      );

      await this.cacheManager.set(`game-${id}`, game);
      return game;
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGamesByIds(ids: number[]) : Promise<GameResponseDto[]> {
    try {
      const games = await this.gamesService.send<GameResponseDto>('games.get-by-ids', ids).pipe(toArray());
      return await firstValueFrom(games);
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
