import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TechnicalTasksService } from './technical-tasks.service';
import { CreateTechnicalTaskDto } from './dto/create-technical-task.dto';
import { TechnicalTasksResponseDto } from './dto/technical-task-response.dto';
import { UpdateTaskJobDto } from './dto/update-task-job.dto';
import { TechnicalTasksJobResponseDto } from './dto/technical-task-job-response.dto';

@Controller('tasks')
export class TechnicalTasksController {
     constructor(private technicalTaskService: TechnicalTasksService) {}

     @Post()
     async createTechnicalTask(@Body() createTechnicalTaskDto : CreateTechnicalTaskDto) : Promise<TechnicalTasksResponseDto> {
        return await this.technicalTaskService.createTechnicalTask(createTechnicalTaskDto);
     }

     @Patch('/jobs/:jobId')
     async updateTechnicalTaskJob(@Param('jobId', ParseIntPipe) jobId : number, @Body() updateTaskJobDto : UpdateTaskJobDto) : Promise<TechnicalTasksJobResponseDto> {
        return await this.technicalTaskService.updateTaskJob(jobId, updateTaskJobDto);
     }

     @Get()
     async getAllTechnicalTasks() : Promise<TechnicalTasksResponseDto[]>{
        return await this.technicalTaskService.getAllTechnicalTasks();
     }
}
