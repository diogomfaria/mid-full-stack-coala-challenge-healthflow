import { ApiProperty } from '@nestjs/swagger';
import { ExamStatus } from '../domain/exam-status.enum';

export class ExamResponseDto {
  @ApiProperty({ example: 'uuid-do-exame' })
  id: string;

  @ApiProperty({ enum: ExamStatus, example: ExamStatus.PENDING })
  status: ExamStatus;

  @ApiProperty({ nullable: true })
  processingResult?: string | null;

  @ApiProperty({ nullable: true })
  report?: string | null;

  @ApiProperty({ example: 'uuid-do-atendente' })
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}