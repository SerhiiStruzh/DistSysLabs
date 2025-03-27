import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async deleteUser(userId: number): Promise<UserResponseDto | undefined> {
        try {
          const deletedUser = await this.prisma.user.delete({
            where: {
              id: userId,
            },
          });

          const deletedUserDto: UserResponseDto = {
            id: deletedUser.id,
            role: deletedUser.role,
          };
      
          return deletedUserDto;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
              throw new NotFoundException(`User with ID ${userId} not found`);
            }
          } else {
            throw new InternalServerErrorException('Unexpected error occurred.'); 
          }
        }
      }

    async createUser(createUserDto: CreateUserDto) : Promise<UserResponseDto> {
        const { role, hourRate, qualification } = createUserDto;

        if (role === 'developer') {
            if (hourRate === undefined || qualification === undefined) {
                throw new BadRequestException('For developers, both hourly rate and qualification are required.');
            }
        }

        const user = await this.prisma.user.create({
            data: {
              role: role,
              developerInfo: role === 'developer' ? {
                create: {
                  hourRate: hourRate!, 
                  qualification: qualification!, 
                },
              } : undefined,
            },
        });
    
        const updateResponseDto: UserResponseDto = {
          id: user.id,
          role: user.role,
          hourRate: hourRate,
          qualification: qualification,
        };
    
        return updateResponseDto;
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
      const users = await this.prisma.user.findMany({
        include: {
          developerInfo: true,
        },
      });

      const userDtos = users.map(user => {
        return new UserResponseDto(
          user.id,
          user.role,
          user.role === 'developer' ? user.developerInfo?.hourRate : undefined,
          user.role === 'developer' ? user.developerInfo?.qualification : undefined,
        );
      });
  
      return userDtos;
    }

    async getUsersByRole(role: string): Promise<UserResponseDto[]> {
      const users = await this.prisma.user.findMany({
        where: {
          role: role,
        },
        include: {
          developerInfo: true,
        },
      });
    
      const userDtos = users.map(user => {
        return new UserResponseDto(
          user.id,
          user.role,
          user.role === 'developer' ? user.developerInfo?.hourRate : undefined,
          user.role === 'developer' ? user.developerInfo?.qualification : undefined,
        );
      });
    
      return userDtos;
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
      try {
        const user = await this.prisma.user.findFirst({
          where: {
            id: userId,
          },
        });
    
        if (!user) {
          throw new NotFoundException('User not found.');
        }
    
        if (user.role === 'developer') {
          await this.prisma.developerInfo.update({
            where: { userId: userId },
            data: {
              hourRate: updateUserDto.hourRate,
              qualification: updateUserDto.qualification,
            },
          });
        }
    
        const updatedUserDto = new UserResponseDto(
          user.id,
          user.role,
          user.role === 'developer' ? updateUserDto.hourRate : undefined,
          user.role === 'developer' ? updateUserDto.qualification : undefined,
        );
    
        return updatedUserDto;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new NotFoundException('User not found or invalid data.');
        }
        throw new InternalServerErrorException('Error occurred while updating user.');
      }
    }
}
