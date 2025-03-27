import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateTaskJobDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    qualification?: string;

    @IsInt()
    @Min(1) 
    @IsOptional()
    specialistsNeeded?: number;
}