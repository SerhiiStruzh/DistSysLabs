import { IsString, IsEnum, IsArray, IsOptional, IsDateString, IsDefined, IsInt } from 'class-validator';
import { PlatformEnum } from '../enums/platforms.enum';

export class UpdateGameDto {
  @IsInt()
  gameId: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional() 
  @IsString()
  genre?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(PlatformEnum, { each: true, message: 'Each platform must be a valid platform' })
  platforms?: string[];

  @IsOptional() 
  @IsDateString({}, { message: 'Release date must be a valid date string' })
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
