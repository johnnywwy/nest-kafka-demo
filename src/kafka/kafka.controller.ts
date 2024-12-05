import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { KafkaService } from './kafka.service';
import { EventPattern } from '@nestjs/microservices';

@ApiTags('kafka')
@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) { }

  @Post('produce')
  @ApiOperation({ summary: 'Produce a message to Kafka' })
  @ApiBody({ description: 'Message to produce', required: true, type: String })
  @ApiResponse({ status: 201, description: 'Message produced' })
  async produce(@Body('message') message: string) {
    console.log('Producing message:', message);
    await this.kafkaService.sendMessage('entity-created', message);
    return { status: 'Message produced' };
  }

  @EventPattern('entity-created')
  async handleEntityCreated(payload: any) {
    console.log('是不是过来了');

    console.log(JSON.stringify(payload) + ' created');
  }
}
