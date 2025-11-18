import type { Exam } from "@/types/exam";
import { apiFetch } from "@/lib/api";

export type CreateExamPayload = {
  description: string;
  patientName: string;
};

export async function createExam(
  data: CreateExamPayload,
  token: string,
): Promise<Exam> {
  return apiFetch<Exam>("/exams/upload", {
    method: "POST",
    body: data,
    token,
  });
}

export async function getExams(token: string): Promise<Exam[]> {
  return apiFetch<Exam[]>("/exams", {
    token,
  });
}

export async function retryExam(id: string, token: string): Promise<Exam> {
  return apiFetch<Exam>(`/exams/${id}/retry`, {
    method: "POST",
    token,
  });
}

export async function submitExamReport(
  id: string,
  report: string,
  token: string,
): Promise<Exam> {
  return apiFetch<Exam>(`/exams/${id}/report`, {
    method: "POST",
    body: { report },
    token,
  });
}
