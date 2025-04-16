import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsInt } from 'class-validator';

export class UpdatePlayerDto {
  @IsInt()
  playerId: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must be no longer than 20 characters' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
