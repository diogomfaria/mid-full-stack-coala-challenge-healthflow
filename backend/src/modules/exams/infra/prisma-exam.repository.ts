import { Injectable } from '@nestjs/common';
import {
  CreateExamProps,
  ExamsRepository,
  UpdateProcessingProps,
  UpdateReportProps,
} from '../domain/exams.repository';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { MedicalExam } from '../domain/medical-exam.entity';
import { ExamStatus } from '../domain/exam-status.enum';
import {
  MedicalExam as PrismaMedicalExam,
  ExamStatus as PrismaExamStatus,
} from '@prisma/client';

@Injectable()
export class PrismaExamRepository implements ExamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(exam: PrismaMedicalExam): MedicalExam {
    return {
      id: exam.id,
      status: exam.status as ExamStatus,
      processingResult: exam.processingResult,
      report: exam.report,
      createdById: exam.createdById,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      description: exam.description,
      patientName: exam.patientName,
    };
  }

  async create(data: CreateExamProps): Promise<MedicalExam> {
    const created = await this.prisma.medicalExam.create({
      data: {
        createdById: data.createdById,
        description: data.description,
        patientName: data.patientName,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<MedicalExam | null> {
    const exam = await this.prisma.medicalExam.findUnique({
      where: { id },
    });

    return exam ? this.toDomain(exam) : null;
  }

  async listAll(): Promise<MedicalExam[]> {
    const exams = await this.prisma.medicalExam.findMany();
    return exams.map((e) => this.toDomain(e));
  }

  async listDone(): Promise<MedicalExam[]> {
    const exams = await this.prisma.medicalExam.findMany({
      where: { status: PrismaExamStatus.DONE },
    });
    return exams.map((e) => this.toDomain(e));
  }

  async updateProcessing(data: UpdateProcessingProps): Promise<MedicalExam> {
    const updated = await this.prisma.medicalExam.update({
      where: { id: data.id },
      data: {
        status: data.status as PrismaExamStatus,
        processingResult: data.processingResult,
      },
    });

    return this.toDomain(updated);
  }

  async updateReport(data: UpdateReportProps): Promise<MedicalExam> {
    const updated = await this.prisma.medicalExam.update({
      where: { id: data.id },
      data: {
        status: data.status as PrismaExamStatus,
        report: data.report,
      },
    });

    return this.toDomain(updated);
  }
}