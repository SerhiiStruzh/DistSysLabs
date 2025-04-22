import { IsInt } from "class-validator";

export class DeleteGameFromLibrary {
    @IsInt()
    userId: number;

    @IsInt()
    gameId: number;
}