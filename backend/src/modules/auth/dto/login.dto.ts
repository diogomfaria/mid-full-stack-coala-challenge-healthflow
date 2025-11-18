import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'attendant@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'minhaSenha123' })
  @IsString()
  password: string;
}