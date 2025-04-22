import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';
import { GameResponseDto } from 'src/games/dto/response-game.dto';
import { firstValueFrom, toArray } from 'rxjs';

@Injectable()
export class LibraryService {
    constructor(@Inject('LIBRARY_SERVICE') private readonly libraryService: ClientProxy) {}

    async addGameToLibrary(
        userId: number,
        gameLibraryDto: AddGameToLibraryDto,
      ): Promise<GameResponseDto> {
        try {
            return await firstValueFrom(
                this.libraryService.send<GameResponseDto>('library.add', {userId: userId, ...gameLibraryDto})
            );
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
      async removeGameFromLibrary(userId: number, gameId: number): Promise<void> {
        try {
            await firstValueFrom(
                this.libraryService.send('library.delete', { userId, gameId })
            );
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
      async getGamesInLibrary(userId: number): Promise<GameResponseDto[]> {
        try {
            const games = await this.libraryService.send<GameResponseDto>('library.player-games', userId).pipe(toArray());
            return await firstValueFrom(games);
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}
