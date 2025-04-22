import { Controller } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingResponseDto } from './dto/rating-response.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { MessagePattern } from '@nestjs/microservices';
import { DeleteRatingDto } from './dto/delete-rating.dto';

@Controller()
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @MessagePattern('ratings.create')
    async createRating(createRatingDto: CreateRatingDto): Promise<RatingResponseDto> {
      return await this.ratingsService.createRating(createRatingDto.playerId, createRatingDto);
    }

    @MessagePattern('ratings.game-ratings')
    async getRatingsForGame(gameId: number): Promise<RatingResponseDto[]> {
      return await this.ratingsService.getRatingsForGame(gameId);
    }

    @MessagePattern('ratings.delete')
    async deleteRating(deleteRatingDto: DeleteRatingDto): Promise<boolean> {
      return await this.ratingsService.deleteRating(deleteRatingDto.playerId, deleteRatingDto.ratingId);
    }

    @MessagePattern('ratings.update')
    async updateRating(updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> { 
      return this.ratingsService.updateRating(updateRatingDto.playerId, updateRatingDto);
    }
}
