import { ExamStatus } from './exam-status.enum';

export interface MedicalExam {
  id: string;
  status: ExamStatus;
  processingResult?: string | null;
  report?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  description: string;
  patientName: string;  
}