import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // 注入 Kafka 客户端
  ) { }

  // 在模块初始化时连接到 Kafka
  onModuleInit() {
    const requestPatterns = [
      'entity-created',
    ];

    requestPatterns.forEach(pattern => {
      this.kafkaClient.subscribeToResponseOf(pattern);
    });
  }

  // 生产消息到 Kafka 主题
  async sendMessage(topic: string, message: string) {
    try {
      const result = await lastValueFrom(
        this.kafkaClient.emit(topic, { value: message }),
      );
      this.logger.log(`Message sent to ${topic}: ${message}`);
      return result;
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw error;
    }
  }
}
