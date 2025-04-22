import { IsInt, IsPositive } from 'class-validator';

export class AddGameToLibraryDto {
  @IsInt()
  userId: number;

  @IsInt()
  gameId: number;
}
