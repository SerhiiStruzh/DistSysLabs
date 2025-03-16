import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class CreateProjectDto {
    @IsInt()
    taskId: number;
  
    @IsInt()
    managerId: number;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    developerIds: number[];
  }