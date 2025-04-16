import { Controller } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerResponseDto } from './dto/response-player.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('users')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @MessagePattern('players.get-all')
    async getAllPlayers(): Promise<PlayerResponseDto[]> {
        return this.playersService.getAllPlayers();
    }

    @MessagePattern('players.get-by-id')
    async getPlayerById(id: number): Promise<PlayerResponseDto> {
        return this.playersService.getPlayerById(id);
    }

    @MessagePattern('players.update')
    async updatePlayer(updatePlayerDto: UpdatePlayerDto): Promise<PlayerResponseDto> {
        return this.playersService.updatePlayer(updatePlayerDto);
    }
}
