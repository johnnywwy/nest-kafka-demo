import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { microserviceConfig } from './microservice/microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('My Kafka App')
    .setDescription('The Kafka API description')
    .setVersion('1.0')
    .addTag('kafka')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.connectMicroservice(microserviceConfig);

  await app.startAllMicroservices();

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
