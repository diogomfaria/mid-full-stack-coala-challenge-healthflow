import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { RabbitMQModule } from 'src/infra/rabbitmq/rabbitmq.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { PrismaExamRepository } from './infra/prisma-exam.repository';
import { EXAMS_REPOSITORY } from './domain/exams.repository';
import { ExamQueuePublisher } from './infra/exam-queue.publisher';
import { ExamConsumer } from './infra/exam.consumer';

@Module({
  imports: [PrismaModule, RabbitMQModule],
  controllers: [ExamsController],
  providers: [
    ExamsService,
    ExamQueuePublisher,
    ExamConsumer,
    {
      provide: EXAMS_REPOSITORY,
      useClass: PrismaExamRepository,
    },
  ],
})
export class ExamsModule {}