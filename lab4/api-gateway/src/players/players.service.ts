import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlayerResponseDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { firstValueFrom, toArray } from 'rxjs';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PlayersService implements OnModuleInit {
    constructor(@Inject('PLAYERS_SERVICE') private playersService: ClientProxy,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async onModuleInit() {
        await this.playersService.connect();
    }

    async getAllPlayers(): Promise<PlayerResponseDto[]> {
        try {
            const players = this.playersService.send<PlayerResponseDto>('players.get-all', {}).pipe(toArray());
            return await firstValueFrom(players);
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPlayerById(id: number): Promise<PlayerResponseDto> {
        try {
            const cachedPlayer = await this.cacheManager.get<PlayerResponseDto>(`player-${id}`);
            if(cachedPlayer) return cachedPlayer;

            const player = await firstValueFrom(
                this.playersService.send<PlayerResponseDto>('players.get-by-id', id)
            );

            await this.cacheManager.set(`player-${id}`, player);
            return player;
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePlayer(playerId: number, updatePlayerDto: UpdatePlayerDto): Promise<PlayerResponseDto> {
        try {
            const player = await firstValueFrom(
                this.playersService.send<PlayerResponseDto>('players.update', {playerId: playerId, ...updatePlayerDto})
            );

            await this.cacheManager.set(`player-${playerId}`, player);
            return player;
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
