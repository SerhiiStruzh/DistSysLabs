import { IsInt } from "class-validator";

export class DeleteRatingDto {
    @IsInt()
    playerId: number;

    @IsInt()
    ratingId: number;
}