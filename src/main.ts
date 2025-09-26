import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filter/AllExceptionsFilter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  const environment = process.env.NODE_ENV || 'development';
  const host = process.env.HOST || 'http://localhost'
  
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  // Setup Swagger only when not in production
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Ticket Management API')
      .setDescription('A comprehensive API for managing support tickets with features like creation, updates, filtering, searching, and sorting')
      .setVersion('1.0')
      .addTag('Tickets', 'Ticket management operations')
      .addTag('Admin', 'Administrative operations')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
      },
    });
    
    logger.log(`Swagger documentation available at: ${host}:${port}/api/docs`);
  }
  
  await app.listen(port);
  logger.log(`Application is running on: ${host}:${port}`);
  logger.log(`Environment: ${environment}`);
}
bootstrap();
