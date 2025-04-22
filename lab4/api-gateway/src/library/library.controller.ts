import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';
import { GameResponseDto } from 'src/games/dto/response-game.dto';

@Controller('library')
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async addGameToLibrary(@Req() request: Request, @Body() gameLibraryDto: AddGameToLibraryDto): Promise<GameResponseDto> {
        return await this.libraryService.addGameToLibrary(request['user'].userId, gameLibraryDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gameId')
    async removeGameFromLibrary(@Req() request: Request, @Param('gameId', ParseIntPipe) gameId: number): Promise<void> {
        await this.libraryService.removeGameFromLibrary(request['user'].userId, gameId);
    }

    @Get('users/:userId')
    async getGamesInLibrary(@Param('userId', ParseIntPipe) userId: number): Promise<GameResponseDto[]> {
        return await this.libraryService.getGamesInLibrary(userId);
    }
}
