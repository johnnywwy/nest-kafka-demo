import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,  // 注入 Kafka 客户端
  ) { }

  // 在模块初始化时连接到 Kafka
  async onModuleInit() {
    this.logger.log('Connecting to Kafka...');
    await this.client.connect();  // 连接到 Kafka 客户端
    this.logger.log('Connected to Kafka');
  }

  // 生产消息到 Kafka 主题
  async produceMessage(topic: string, message: string) {
    this.logger.log(`Producing message to topic ${topic}: ${message}`);
    this.client.emit(topic, message);  // 发送消息到 Kafka（异步）
  }

  // 消费消息，通过 @MessagePattern 监听 Kafka 主题
  @MessagePattern('my-topic')  // 监听 'my-topic' 主题的消息
  async consumeMessage(@Payload() payload: any) {
    this.logger.log(`Consumed message from Kafka: ${JSON.stringify(payload)}`);
    // 这里可以添加消息处理的业务逻辑，例如存储数据库、业务处理等
    return 'Message processed';  // 返回一个处理结果
  }

  // 销毁时关闭 Kafka 客户端连接
  async onModuleDestroy() {
    this.logger.log('Closing Kafka client connection...');
    await this.client.close();
    this.logger.log('Kafka client connection closed');
  }
}
