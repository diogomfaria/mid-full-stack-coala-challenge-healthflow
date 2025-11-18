import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from 'src/infra/rabbitmq/rabbitmq.service';

@Injectable()
export class ExamQueuePublisher {
  private readonly queueName: string;

  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly configService: ConfigService,
  ) {
    this.queueName =
      this.configService.get<string>('RABBITMQ_EXAM_QUEUE') ??
      'exam_processing_queue';
  }

  async publishExamCreated(examId: string): Promise<void> {
    await this.rabbitMQ.publish(this.queueName, { examId });
  }
}