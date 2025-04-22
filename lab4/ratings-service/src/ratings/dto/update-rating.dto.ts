import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateRatingDto {
  @IsInt()
  playerId: number;

  @IsInt()
  ratingId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;
}
