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
  const host = process.env.HOST || 'http://localhost';
  
  // CORS configuration with whitelist from environment variables
  const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:8080', 'http://192.168.1.101:8080'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });
  
  logger.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  
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
