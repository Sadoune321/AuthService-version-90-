// src/config/redis.config.ts
import { Redis } from '@upstash/redis';
import { registerAs } from '@nestjs/config';

// Configuration NestJS
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
}));

// Client Redis pour l'application
export const redisClient = new Redis({
  url: process.env.REDIS_HOST,
  token: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
});