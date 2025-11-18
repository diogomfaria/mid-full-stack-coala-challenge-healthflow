import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from 'src/infra/rabbitmq/rabbitmq.service';
import {
  EXAMS_REPOSITORY,
  ExamsRepository,
} from '../domain/exams.repository';
import { ExamStatus } from '../domain/exam-status.enum';

type ExamMessagePayload = {
  examId: string;
};

@Injectable()
export class ExamConsumer implements OnModuleInit {
  private readonly logger = new Logger(ExamConsumer.name);
  private readonly queueName: string;

  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly configService: ConfigService,
    @Inject(EXAMS_REPOSITORY)
    private readonly examsRepository: ExamsRepository,
  ) {
    this.queueName =
      this.configService.get<string>('RABBITMQ_EXAM_QUEUE') ??
      'exam_processing_queue';
  }

  async onModuleInit() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    if (!url) {
      this.logger.warn('RABBITMQ_URL não configurado. ExamConsumer desabilitado.');
      return;
    }

    await this.rabbitMQ.consume(this.queueName, (payload: ExamMessagePayload) =>
      this.handleMessage(payload),
    );

    this.logger.log(`Ouvindo fila RabbitMQ: ${this.queueName}`);
  }

  private async handleMessage({ examId }: ExamMessagePayload): Promise<void> {
    this.logger.log(`Processando exame ${examId}`);

    await this.examsRepository.updateProcessing({
      id: examId,
      status: ExamStatus.PROCESSING,
      processingResult: 'Processando exame...',
    });

    const delay = 2000 + Math.floor(Math.random() * 3000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const success = Math.random() < 0.7;

    if (success) {
      await this.examsRepository.updateProcessing({
        id: examId,
        status: ExamStatus.DONE,
        processingResult: 'Processamento concluído com sucesso.',
      });
    } else {
      await this.examsRepository.updateProcessing({
        id: examId,
        status: ExamStatus.ERROR,
        processingResult: 'Falha no processamento do exame.',
      });
    }
  }
}