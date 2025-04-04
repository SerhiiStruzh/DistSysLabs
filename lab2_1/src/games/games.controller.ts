import { Controller, Post, Body, Param, Delete, Get, Patch } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/response-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto): Promise<GameResponseDto> {
    return this.gameService.createGame(createGameDto);
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<void> {
    return this.gameService.deleteGame(Number(id));
  }

  @Patch(':id')
  async updateGame(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<GameResponseDto> {
    return this.gameService.updateGame(Number(id), updateGameDto);
  }

  @Get()
  async getAllGames(): Promise<GameResponseDto[]> {
    return this.gameService.getAllGames();
  }
}
