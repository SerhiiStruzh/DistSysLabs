import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateTaskJobDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsInt()
  @Min(1) 
  specialistsNeeded: number;
}