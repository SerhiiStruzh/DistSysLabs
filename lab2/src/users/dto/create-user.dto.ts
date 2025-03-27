import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

enum Role {
    Developer = 'developer',
    Manager = 'manager',
    Customer = 'customer',
}

export class CreateUserDto {
  @IsEnum(Role) 
  role: Role;

  @IsOptional()
  @IsNumber()
  hourRate?: number;

  @IsOptional()
  @IsString()
  qualification?: string;
}
