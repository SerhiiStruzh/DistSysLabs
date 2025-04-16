import { Body, Controller, Get, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerResponseDto } from './dto/response-player.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Get()
    async getAllPlayers(): Promise<PlayerResponseDto[]> {
        return this.playersService.getAllPlayers();
    }

    @Get(':id')
    async getPlayerById(@Param('id', ParseIntPipe) id: number): Promise<PlayerResponseDto> {
        return this.playersService.getPlayerById(id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updatePlayer(
        @Req() request: Request,
        @Body() updatePlayerDto: UpdatePlayerDto,
    ): Promise<PlayerResponseDto> {
        return this.playersService.updatePlayer(request['user'].userId, updatePlayerDto);
    }
}
