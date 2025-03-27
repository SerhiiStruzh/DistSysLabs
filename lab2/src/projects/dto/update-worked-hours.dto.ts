import { IsInt, Min } from "class-validator";

export class UpdateWorkedHoursDto {
    @IsInt()
    @Min(0)
    hoursWorked: number;
}