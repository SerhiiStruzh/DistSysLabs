import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTechnicalTaskDto } from './dto/create-technical-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TechnicalTasksResponseDto } from './dto/technical-task-response.dto';
import { Prisma } from '@prisma/client';
import { TechnicalTasksJobResponseDto } from './dto/technical-task-job-response.dto';
import { UpdateTaskJobDto } from './dto/update-task-job.dto';

@Injectable()
export class TechnicalTasksService {

    constructor(private prisma: PrismaService) {}

    async createTechnicalTask(createTechnicalTaskDto: CreateTechnicalTaskDto): Promise<TechnicalTasksResponseDto> {
        try {
          const { description, taskJobs } = createTechnicalTaskDto;
    
          const technicalTask = await this.prisma.technicalTask.create({
            data: {
              description,
              customerId: createTechnicalTaskDto.customerId,
              taskJobs: {
                create: taskJobs.map(job => ({
                  description: job.description,
                  qualification: job.qualification,
                  specialistsNeeded: job.specialistsNeeded,
                })),
              },
            },
            include: {
              taskJobs: true,
            },
          });
    
          const taskJobsResponse: TechnicalTasksJobResponseDto[] = technicalTask.taskJobs.map(job => ({
            id: job.id,
            description: job.description,
            qualification: job.qualification,
            specialistsNeeded: job.specialistsNeeded,
          }));
    
          const response: TechnicalTasksResponseDto = {
            id: technicalTask.id,
            customerId: technicalTask.customerId,
            description: technicalTask.description,
            taskJobs: taskJobsResponse,
          };
    
          return response;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException('Invalid data provided for creating the technical task.');
          }
          throw new InternalServerErrorException('An error occurred while creating the technical task.');
        }
      }

      async updateTaskJob(jobId: number, updateTaskJobDto: UpdateTaskJobDto) : Promise<TechnicalTasksJobResponseDto> {
        try {
          const updatedTaskJob = await this.prisma.taskJob.update({
            where: { id: jobId },
            data: {
              description: updateTaskJobDto.description,
              qualification: updateTaskJobDto.qualification,
              specialistsNeeded: updateTaskJobDto.specialistsNeeded,
            },
          });
      
          return {
            id: jobId,
            description: updatedTaskJob.description,
            qualification: updatedTaskJob.qualification,
            specialistsNeeded: updatedTaskJob.specialistsNeeded,
          };
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Task job with ID ${jobId} not found.`);
          }
          throw new InternalServerErrorException('An error occurred while updating the task job.');
        }
    }

    async getAllTechnicalTasks() : Promise<TechnicalTasksResponseDto[]> {
        const technicalTasks = await this.prisma.technicalTask.findMany({
          include: {
            taskJobs: true,
          },
        });
      
        return technicalTasks.map(task => ({
          id: task.id,
          customerId: task.customerId,
          description: task.description,
          taskJobs: task.taskJobs.map(job => ({
            id: job.id,
            description: job.description,
            qualification: job.qualification,
            specialistsNeeded: job.specialistsNeeded,
          })),
        }));
      }
}
