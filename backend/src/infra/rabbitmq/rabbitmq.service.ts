import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    if (!url) {
      this.logger.warn('RABBITMQ_URL não configurado. RabbitMQ desabilitado.');
      return;
    }

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    this.logger.log('Conectado ao RabbitMQ');
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private async assertQueue(queue: string) {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado');
    }
    await this.channel.assertQueue(queue, { durable: true });
  }

  async publish(queue: string, message: unknown): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado');
    }
    await this.assertQueue(queue);

    const content = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(queue, content, { persistent: true });
  }

  async consume(
    queue: string,
    handler: (payload: any) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Canal RabbitMQ não inicializado');
    }
    await this.assertQueue(queue);

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        await handler(payload);
        this.channel!.ack(msg);
      } catch (error) {
        this.logger.error(
          `Erro processando mensagem da fila ${queue}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        this.channel!.nack(msg, false, false);
      }
    });
  }
}