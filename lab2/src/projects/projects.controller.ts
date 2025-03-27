import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsResponseDto } from './dto/project-response.dto';
import { UpdateWorkedHoursDto } from './dto/update-worked-hours.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService){}

    @Post()
    async createProject(@Body() createProjectDto: CreateProjectDto) : Promise<ProjectsResponseDto> {
        return await this.projectService.createProject(createProjectDto);
    }

    @Delete(':projectId')
    async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) : Promise<void>{
        await this.projectService.deleteProject(projectId);
    }

    @Get()
    async getAllProjects() : Promise<ProjectsResponseDto[]> {
        return await this.projectService.getAllProjects();
    }

    @Patch(':projectId/developers/:developerId')
    async updateDeveloperWorkedHours(
                                     @Param('projectId', ParseIntPipe) projectId: number, 
                                     @Param('developerId', ParseIntPipe) developerId: number,
                                     @Body() updateWorkedHoursDto: UpdateWorkedHoursDto
                                    ) : Promise<void> 
    {   
        await this.projectService.updateDeveloperWorkedHours(projectId, developerId, updateWorkedHoursDto.hoursWorked);
    }
}
