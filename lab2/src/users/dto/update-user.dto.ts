import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNumber()
    hourRate?: number;

    @IsOptional()
    @IsString()
    qualification?: string;
}
