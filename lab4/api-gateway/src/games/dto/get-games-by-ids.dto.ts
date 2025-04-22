import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class GetGamesByIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
