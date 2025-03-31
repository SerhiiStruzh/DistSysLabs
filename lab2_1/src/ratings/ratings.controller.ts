import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Request } from 'express';
import { RatingResponseDto } from './dto/rating-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createRating(
      @Req() request: Request,
      @Body() createRatingDto: CreateRatingDto,
    ): Promise<RatingResponseDto> {
      return await this.ratingsService.createRating(request['user'].userId, createRatingDto);
    }

    @Get('game/:gameId')
    async getRatingsForGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<RatingResponseDto[]> {
      return await this.ratingsService.getRatingsForGame(gameId);
    }

    @Delete(':ratingId')
    @UseGuards(JwtAuthGuard)
    async deleteRating(@Req() request: Request, @Param('ratingId', ParseIntPipe) ratingId: number) {
      await this.ratingsService.deleteRating(request['user'].userId, ratingId);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateRating(
      @Req() request: Request,
      @Body() updateRatingDto: UpdateRatingDto,
    ) { 
      return this.ratingsService.updateRating(request['user'].userId, updateRatingDto);
    }
}
