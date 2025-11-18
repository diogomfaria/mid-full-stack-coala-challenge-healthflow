import { MedicalExam } from './medical-exam.entity';
import { ExamStatus } from './exam-status.enum';

export type CreateExamProps = {
  createdById: string;
  description: string;
  patientName: string;
};

export type UpdateProcessingProps = {
  id: string;
  status: ExamStatus;
  processingResult: string;
};

export type UpdateReportProps = {
  id: string;
  report: string;
  status: ExamStatus;
};

export interface ExamsRepository {
  create(data: CreateExamProps): Promise<MedicalExam>;
  findById(id: string): Promise<MedicalExam | null>;
  listAll(): Promise<MedicalExam[]>;
  listDone(): Promise<MedicalExam[]>;
  updateProcessing(data: UpdateProcessingProps): Promise<MedicalExam>;
  updateReport(data: UpdateReportProps): Promise<MedicalExam>;
}

export const EXAMS_REPOSITORY = Symbol('EXAMS_REPOSITORY');