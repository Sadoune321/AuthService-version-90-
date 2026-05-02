import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import redisClient from './config/redis.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());

 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));


  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  
  try {
    await redisClient.set('ping', 'pong');
    const value = await redisClient.get('ping');
    console.log('✅ Redis ping:', value);
  } catch (err) {
    console.error('❌ Erreur Redis:', err);
  }

 
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`🚀 AuthService running on port ${port}`);
}
bootstrap();
