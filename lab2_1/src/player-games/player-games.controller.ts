import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { PlayerGamesService } from './player-games.service';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';
import { GameResponseDto } from 'src/games/dto/response-game.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('library')
export class PlayerGamesController {
    constructor(private readonly playerGamesService: PlayerGamesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async addGameToLibrary(@Req() request: Request, @Body() gameLibraryDto: AddGameToLibraryDto): Promise<GameResponseDto> {
        return await this.playerGamesService.addGameToLibrary(request['user'].userId, gameLibraryDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gameId')
    async removeGameFromLibrary(@Req() request: Request, @Param('gameId', ParseIntPipe) gameId: number): Promise<void> {
        await this.playerGamesService.removeGameFromLibrary(request['user'].userId, gameId);
    }

    @Get('users/:userId')
    async getGamesInLibrary(@Param('userId', ParseIntPipe) userId: number): Promise<GameResponseDto[]> {
        return await this.playerGamesService.getGamesInLibrary(userId);
    }
}
