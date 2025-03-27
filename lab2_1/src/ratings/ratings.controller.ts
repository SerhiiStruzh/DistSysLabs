import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Request } from 'express';
import { RatingResponseDto } from './dto/rating-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createRating(
      @Body() createRatingDto: CreateRatingDto,
      @Req() request: Request,
    ): Promise<RatingResponseDto> {
      return await this.ratingsService.createRating(request['user'].userId, createRatingDto);
    }

    @Get('game/:gameId')
    async getRatingsForGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<RatingResponseDto[]> {
      return await this.ratingsService.getRatingsForGame(gameId);
    }
}
