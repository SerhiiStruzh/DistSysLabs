import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRating(
      playerId: number,
      createRatingDto: CreateRatingDto,
    ): Promise<RatingResponseDto> {
      const { rating, review, gameId } = createRatingDto;

      const existingRating = await this.prisma.rating.findFirst({
        where: {
          AND: [
            {playerId: playerId},
            {gameId: gameId}
          ]
        },
      });

      if (existingRating) {
          throw new RpcException({
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'You have already rated this game',
          });
      }

      const createRating = await this.prisma.rating.create({
        data: {
          rating,    
          review,    
          playerId,  
          gameId,    
        }
      });
      

      return {
        id: createRating.id,
        rating: createRating.rating,
        review: createRating.review ? createRating.review : undefined,
        createdAt: createRating.createdAt,
        playerId: createRating.playerId,
        gameId: createRating.gameId,
      };
    }

  async getRatingsForGame(gameId: number): Promise<RatingResponseDto[]> {
    const ratings = await this.prisma.rating.findMany({
      where: {
        gameId,
      }
    });

    return ratings.map((rating) => ({
      id: rating.id,
      rating: rating.rating,
      review: rating.review ? rating.review : undefined,
      createdAt: rating.createdAt,
      playerId: rating.playerId,
      gameId: rating.gameId,
    }));
  }

  async deleteRating(playerId: number, ratingId: number): Promise<boolean> {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Rating not found',
      });
    }

    if (rating.playerId !== playerId) {
      throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You can only delete your own rating',
      });
    }

    await this.prisma.rating.delete({
      where: { id: ratingId },
    });

    return true;
  }

  async updateRating(playerId: number, updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> {
    const { ratingId, rating, review } = updateRatingDto;

    const ratingToUpdate = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!ratingToUpdate) {
      throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Rating not found',
      });
    }

    if (ratingToUpdate.playerId !== playerId) {
      throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message:'You can only update your own rating',
      });
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id: ratingId },
      data: {
        rating: rating ?? ratingToUpdate.rating,
        review: review ?? ratingToUpdate.review,
      }
    });

    return {
      id: updatedRating.id,
      rating: updatedRating.rating,
      review: updatedRating.review ?? undefined,
      createdAt: updatedRating.createdAt,
      playerId: updatedRating.playerId,
      gameId: updatedRating.gameId,
    };
  }
}
