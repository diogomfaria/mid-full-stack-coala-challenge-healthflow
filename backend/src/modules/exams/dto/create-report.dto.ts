import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 'Exame sem evidências de alterações significativas.' })
  @IsString()
  @MinLength(1)
  report: string;
}