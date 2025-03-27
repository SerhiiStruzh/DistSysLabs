import { IsString, IsInt, IsArray, Min, Max, IsNotEmpty } from 'class-validator';
import { CreateTaskJobDto } from './create-task-job.dto';

export class CreateTechnicalTaskDto {
  @IsInt()
  @Min(1) 
  customerId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  taskJobs: CreateTaskJobDto[];
}
