import { TeamProjectResponseDto } from "./team-project-response.dto";

export class ProjectsResponseDto {
    id: number;
    managerId: number;
    taskId: number;
    teamMembers: TeamProjectResponseDto[];
}