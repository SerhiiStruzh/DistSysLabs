export class RatingResponseDto {
    id: number;
    rating: number;
    review?: string;
    createdAt: Date;
    playerId: number;
    gameId: number;
}
  