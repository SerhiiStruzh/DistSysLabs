import { TechnicalTasksJobResponseDto } from "./technical-task-job-response.dto";

export class TechnicalTasksResponseDto {
    id: number;
    customerId: number;
    description: string;
    taskJobs: TechnicalTasksJobResponseDto[];
}