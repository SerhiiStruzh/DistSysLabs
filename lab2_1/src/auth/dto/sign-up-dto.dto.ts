import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20, { message: 'Username must be no longer than 20 characters' })
    username: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
