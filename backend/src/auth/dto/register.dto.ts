import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'admin@entwoh.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Minimum 6 character password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Rachana', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
