import { IsString, IsEnum, IsArray, IsOptional, IsDateString } from 'class-validator';
import { PlatformEnum } from '../enums/platforms.enum';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsArray()
  @IsEnum(PlatformEnum, { each: true, message: 'Each platform must be a valid platform' })
  platforms: string[];

  @IsOptional()
  @IsDateString({}, { message: 'Release date must be a valid date string' })
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
