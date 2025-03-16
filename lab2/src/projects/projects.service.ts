import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { TeamProjectResponseDto } from './dto/team-project-response.dto';
import { ProjectsResponseDto } from './dto/project-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    private async validateDeveloperIds(developerIds: number[]): Promise<boolean> {
        const developers = await this.prisma.user.findMany({
          where: {
            id: { in: developerIds },
            role: 'developer',
          },
          select: {
            id: true,
          },
        });
      
        return developers.length === developerIds.length;
    }

    async createProject(createProjectDto: CreateProjectDto) : Promise<ProjectsResponseDto> {
        const { taskId, managerId, developerIds } = createProjectDto;
      
        const technicalTask = await this.prisma.technicalTask.findUnique({
          where: { id: taskId },
          include: {
            taskJobs: true,
          },
        });
      
        if (!technicalTask) {
            throw new NotFoundException('Technical task not found');
        }

        const manager = await this.prisma.user.findUnique({
            where: { id: managerId },
            select: { id: true, role: true },
        });
        
        if (!manager || manager.role !== 'manager') {
          throw new BadRequestException('The provided managerId does not belong to a manager');
        }

        if(await this.validateDeveloperIds(developerIds) !== true) {
            throw new BadRequestException('Some IDs do not belong to developers');
        }
      
        const project = await this.prisma.project.create({
            data: {
              managerId: managerId,
              taskId: taskId,
            },
        });

        await this.prisma.projectTeamMember.createMany({
            data: developerIds.map(developerId => ({
              developerId,
              projectId: project.id, 
              hoursWorked: 0, 
            })),
        });

        const teamMembers = await this.prisma.projectTeamMember.findMany({
            where: { projectId: project.id },
        });

        const teamMembersResponse: TeamProjectResponseDto[] = teamMembers.map(member => ({
          developerId: member.developerId,
          projectId: member.projectId,
          hoursWorked: member.hoursWorked,
        }));
      
        return {
          id: project.id,
          managerId: project.managerId,
          taskId: project.taskId,
          teamMembers: teamMembersResponse,
        };
    }

    async deleteProject(projectId: number) : Promise<void> {
      try{
        await this.prisma.project.delete({
          where: {
            id: projectId
          }
        });
      } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          throw new NotFoundException('Project not found');
        }
        throw new InternalServerErrorException('An error occurred while deleting the project.');
      }
    }

    async getAllProjects() : Promise<ProjectsResponseDto[]> {
      const projects = await this.prisma.project.findMany({
        include: {
          teamMembers: true
        }
      });

      const projectsResponse: ProjectsResponseDto[] = projects.map(({ id, managerId, taskId, teamMembers }) => ({
        id,
        managerId,
        taskId,
        teamMembers: teamMembers.map(({ developerId, projectId, hoursWorked }) => ({
          developerId,
          projectId,
          hoursWorked
        }))
      }));
      
      return projectsResponse;
    }

    async updateDeveloperWorkedHours(projectId: number, developerId: number, hoursWorked: number) : Promise<void> {
      try{
        await this.prisma.projectTeamMember.update({
          where: {
            projectId_developerId: {
              projectId: projectId,
              developerId: developerId
            }
          },
          data: {
            hoursWorked: hoursWorked
          }
        });
      } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new NotFoundException('Data not found');
        } else {
          throw new InternalServerErrorException('An error occurred while updating the data.');
        }
      }
    }
}
