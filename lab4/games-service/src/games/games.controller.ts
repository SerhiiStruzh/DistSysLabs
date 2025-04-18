import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateGameDto } from './dto/create-game.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller()
export class GamesController{
    constructor(private readonly gamesService: GamesService) {}

    @MessagePattern('games.create')
    async createGame(createGameDto: CreateGameDto): Promise<GameResponseDto> {
        return await this.gamesService.createGame(createGameDto);
    }

    @MessagePattern('games.delete')
    async deleteGame(id: number): Promise<void> {
        return this.gamesService.deleteGame(id);
    }

    @MessagePattern('games.update')
    async updateGame(updateGameDto: UpdateGameDto): Promise<GameResponseDto> {
        return this.gamesService.updateGame(updateGameDto.gameId, updateGameDto);
    }

    @MessagePattern('games.get-all')
    async getAllGames(): Promise<GameResponseDto[]> {
        return this.gamesService.getAllGames();
    }
}
