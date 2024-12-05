import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { microserviceConfig } from './microservice/microserviceConfig';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) { }

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [
      'entity-created',
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    // fire event to kafka
    this.client.emit<string>('entity-created', 'some entity ' + new Date());
    return 'fire event to kafka'
    // return this.appService.getHello();
  }

  
}
