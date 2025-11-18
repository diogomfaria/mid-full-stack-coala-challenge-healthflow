import { IsEmail, IsEnum, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '../domain/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'attendant@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ATTENDANT })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}