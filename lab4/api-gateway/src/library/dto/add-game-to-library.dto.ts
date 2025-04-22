import { IsInt, IsPositive } from 'class-validator';

export class AddGameToLibraryDto {
  @IsInt()
  gameId: number;
}
