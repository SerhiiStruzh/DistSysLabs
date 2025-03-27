import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';

@Injectable()
export class RatingsService {
    constructor(private readonly prisma: PrismaService) {}

    async createRating(
        playerId: number,
        createRatingDto: CreateRatingDto,
      ): Promise<RatingResponseDto> {
        const { rating, review, gameId } = createRatingDto;
    
        const libraryGame = await this.prisma.playerGame.findFirst({
          where: {
            AND: [
              {playerId: playerId},
              {gameId: gameId}
            ]
          },
        })

        if(!libraryGame) {
          throw new BadRequestException('You cannot rate a game that is not in your library.');
        }

        const existingRating = await this.prisma.rating.findFirst({
          where: {
            AND: [
              {playerId: playerId},
              {gameId: gameId}
            ]
          },
        });
    
        if (existingRating) {
          throw new BadRequestException('You have already rated this game');
        }
    
        const createRating = await this.prisma.rating.create({
          data: {
            rating,    
            review,    
            playerId,  
            gameId,    
          },
          include: {
            player: true
          }
        });
        
    
        return {
          id: createRating.id,
          rating: createRating.rating,
          review: createRating.review ? createRating.review : undefined,
          createdAt: createRating.createdAt,
          playerId: createRating.playerId,
          username: createRating.player.username,
          gameId: createRating.gameId,
        };
      }

      async getRatingsForGame(gameId: number): Promise<RatingResponseDto[]> {
        const ratings = await this.prisma.rating.findMany({
          where: {
            gameId,
          },
          include: {
            player: true,
          },
        });
    
        return ratings.map((rating) => ({
          id: rating.id,
          rating: rating.rating,
          review: rating.review ? rating.review : undefined,
          createdAt: rating.createdAt,
          playerId: rating.playerId,
          username: rating.player.username,
          gameId: rating.gameId,
        }));
      }
}
