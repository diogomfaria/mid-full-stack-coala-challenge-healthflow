import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadExamDto {
  @ApiProperty({ example: 'TC de tórax' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Diogo' })
  @IsString()
  patientName: string;
}