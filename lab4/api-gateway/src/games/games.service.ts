import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, toArray } from 'rxjs';

@Injectable()
export class GamesService implements OnModuleInit {
  constructor(@Inject('GAMES_SERVICE') private gamesService: ClientProxy) {}

  async onModuleInit() {
    await this.gamesService.connect();
  } 

  async createGame(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    try {
        return await firstValueFrom(
            this.gamesService.send<GameResponseDto>('games.create', createGameDto)
        );
    } catch (error) {
        if(error.statusCode) {
            throw new HttpException(error.message, error.statusCode)
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteGame(id: number): Promise<void> {
    try {
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
      return await firstValueFrom(
          this.gamesService.send<GameResponseDto>('games.update', {gameId: id, ...updateGameDto})
      );
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
      return await firstValueFrom(
          this.gamesService.send<GameResponseDto>('games.get-by-id', id)
      );
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
