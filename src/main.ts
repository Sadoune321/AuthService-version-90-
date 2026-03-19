// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import redisClient from './config/redis.client';// ✅ default export ioredis

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    // Test simple de Redis
    await redisClient.set('ping', 'pong');
    const value = await redisClient.get('ping');
    console.log('Redis ping:', value); // devrait afficher 'pong'
  } catch (err) {
    console.error('Erreur Redis:', err);
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();