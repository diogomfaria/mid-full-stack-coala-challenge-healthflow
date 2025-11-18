import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  EXAMS_REPOSITORY,
  ExamsRepository,
  CreateExamProps,
} from './domain/exams.repository';
import { UploadExamDto } from './dto/upload-exam.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ExamStatus } from './domain/exam-status.enum';
import { MedicalExam } from './domain/medical-exam.entity';
import { UserRole } from '../users/domain/user-role.enum';
import { ExamQueuePublisher } from './infra/exam-queue.publisher';

@Injectable()
export class ExamsService {
  constructor(
    @Inject(EXAMS_REPOSITORY)
    private readonly examsRepository: ExamsRepository,
    private readonly examQueuePublisher: ExamQueuePublisher,
  ) {}

  async uploadExam(
    attendantId: string,
    dto: UploadExamDto,
  ): Promise<MedicalExam> {
    const data: CreateExamProps = {
      createdById: attendantId,
      description: dto.description,
      patientName: dto.patientName,
    };

    const exam = await this.examsRepository.create(data);

    await this.examQueuePublisher.publishExamCreated(exam.id);

    return exam;
  }

  async createReport(examId: string, dto: CreateReportDto): Promise<MedicalExam> {
    const exam = await this.examsRepository.findById(examId);
    if (!exam) {
      throw new BadRequestException('Exame não encontrado');
    }

    if (exam.status !== ExamStatus.DONE) {
      throw new BadRequestException(
        'Só é possível laudar exames com status DONE',
      );
    }

    return this.examsRepository.updateReport({
      id: examId,
      report: dto.report,
      status: ExamStatus.REPORTED,
    });
  }

  async getExamsForUser(
    userId: string,
    role: UserRole,
  ): Promise<MedicalExam[]> {
    if (role === UserRole.ATTENDANT) {
      return this.examsRepository.listAll();
    }

    if (role === UserRole.DOCTOR) {
      return this.examsRepository.listDone();
    }

    return [];
  }
}