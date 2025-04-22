import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { firstValueFrom, toArray } from 'rxjs';

@Injectable()
export class RatingsService {
    constructor(@Inject('RATINGS_SERVICE') private readonly ratingsService: ClientProxy) {}

    async createRating(
        playerId: number,
        createRatingDto: CreateRatingDto,
      ): Promise<RatingResponseDto> {
        try {
            return await firstValueFrom(
                this.ratingsService.send<RatingResponseDto>('ratings.create', {playerId: playerId, ...createRatingDto})
            );
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
    async getRatingsForGame(gameId: number): Promise<RatingResponseDto[]> {
        try {
            const games = await this.ratingsService.send<RatingResponseDto>('ratings.game-ratings', gameId).pipe(toArray());
            return await firstValueFrom(games);
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  
    async deleteRating(playerId: number, ratingId: number): Promise<void> {
        try {
            await firstValueFrom(
                this.ratingsService.send<RatingResponseDto>('ratings.delete', {playerId: playerId, ratingId: ratingId})
            );
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  
    async updateRating(playerId: number, updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
        try {
            return await firstValueFrom(
                this.ratingsService.send<RatingResponseDto>('ratings.update', {playerId: playerId, ...updateRatingDto})
            );
        } catch (error) {
            if(error.statusCode) {
                throw new HttpException(error.message, error.statusCode)
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
