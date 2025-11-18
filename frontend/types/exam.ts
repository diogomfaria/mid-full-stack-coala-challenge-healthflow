export type ExamStatus =
  | "PENDING"
  | "PROCESSING"
  | "DONE"
  | "ERROR"
  | "REPORTED";

export type Exam = {
  id: string;
  status: ExamStatus;
  processingResult: string | null;
  report: string | null;
  createdById: string;
  description: string;
  patientName: string;
  createdAt: string;
  updatedAt: string;
};
