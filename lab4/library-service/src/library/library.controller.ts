import { Controller } from '@nestjs/common';
import { LibraryService } from './library.service';
import { AddGameToLibraryDto } from './dto/add-game-to-library.dto';
import { GameResponseDto } from './dto/response-game.dto';
import { MessagePattern } from '@nestjs/microservices';
import { DeleteGameFromLibrary } from './dto/delete-game-from-library.dto';

@Controller()
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) {}

    @MessagePattern('library.add')
    async addGameToLibrary(gameLibraryDto: AddGameToLibraryDto): Promise<GameResponseDto> {
        return await this.libraryService.addGameToLibrary(gameLibraryDto.userId, gameLibraryDto);
    }

    @MessagePattern('library.delete')
    async removeGameFromLibrary(deleteGameDto: DeleteGameFromLibrary): Promise<boolean> { 
        return await this.libraryService.removeGameFromLibrary(deleteGameDto.userId, deleteGameDto.gameId);
    }

    @MessagePattern('library.player-games')
    async getGamesInLibrary(userId: number): Promise<GameResponseDto[]> {
        return await this.libraryService.getGamesInLibrary(userId);
    }
}
