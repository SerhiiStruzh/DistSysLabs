import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { RoleValidationPipe } from 'src/common/pipes/RoleValidationPipe.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return await this.userService.createUser(createUserDto);
    }

    @Delete(':userId')
    async deleteUser(@Param('userId', ParseIntPipe) userId: number) : Promise<UserResponseDto | undefined> {
        return await this.userService.deleteUser(userId);
    }

    @Get()
    async getUsers(@Query('role', RoleValidationPipe) role: string): Promise<UserResponseDto[]> {
        return role ? await this.userService.getUsersByRole(role) : await this.userService.getAllUsers();
    }

    @Patch(':userId')
    async updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() updateUserDto : UpdateUserDto) : Promise<UserResponseDto>{
        return await this.userService.updateUser(userId, updateUserDto);
    }
}
