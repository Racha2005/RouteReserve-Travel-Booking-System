import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 2. Enable CORS
  app.enableCors();

  // 3. Configure Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('EN2H Booking Platform API')
    .setDescription(
      'A robust NestJS REST API for managing travel services and customer reservations. Built as a technical intern assignment.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 4. Start Server on Configured Port
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📖 API Documentation available at: http://localhost:${port}/api`);
}
bootstrap();
