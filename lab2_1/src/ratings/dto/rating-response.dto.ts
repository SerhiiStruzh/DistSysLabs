export class RatingResponseDto {
    id: number;
    rating: number;
    review?: string;
    createdAt: Date;
    playerId: number;
    username: string;
    gameId: number;
}
  