import { Controller, Post, Body, Param, Delete, Get, Patch, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { GetGamesByIdsDto } from './dto/get-games-by-ids.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto): Promise<GameResponseDto> {
    return this.gameService.createGame(createGameDto);
  }

  @Delete(':id')
  async deleteGame(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.gameService.deleteGame(id);
  }

  @Patch(':id')
  async updateGame(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<GameResponseDto> {
    return this.gameService.updateGame(id, updateGameDto);
  }

  @Get()
  async getAllGames(): Promise<GameResponseDto[]> {
    return this.gameService.getAllGames();
  }

  @Get(":id")
  async getGamesById(@Param('id', ParseIntPipe) id: number): Promise<GameResponseDto> {
    return this.gameService.getGameById(id);
  }

  @Post('by-ids')
  async getGamesByIds(@Body() body: GetGamesByIdsDto): Promise<GameResponseDto[]> {
    return this.gameService.getGamesByIds(body.ids);
  }
}
