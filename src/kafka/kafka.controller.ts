import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { KafkaService } from './kafka.service';

@ApiTags('kafka')
@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) { }

  @Post('produce')
  @ApiOperation({ summary: 'Produce a message to Kafka' })
  @ApiBody({ description: 'Message to produce', required: true, type: String })
  @ApiResponse({ status: 201, description: 'Message produced' })
  async produce(@Body('message') message: string) {
    // 打印到控制台日志
    console.log('Producing message:', message);

    // 调用 Kafka 服务的生产方法
    await this.kafkaService.produceMessage('my-topic', message);

    return { status: 'Message produced' };
  }

  @Get('consume')
  @ApiOperation({ summary: 'Consume a message from Kafka' })
  @ApiResponse({ status: 200, description: 'Message consumed', type: String })
  async consume() {
    // 调用 Kafka 服务的消费方法
    const message = await this.kafkaService.consumeMessage('my-topic');

    // 打印到控制台日志
    console.log('Consumed message:', message);

    return { message };
  }
}
