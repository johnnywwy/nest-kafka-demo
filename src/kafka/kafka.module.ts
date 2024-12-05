import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Kafka broker地址
          },
          consumer: {
            groupId: '1',
            allowAutoTopicCreation: true,  // 如果没有偏移量，可以从头开始消费
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
})
export class KafkaModule { }