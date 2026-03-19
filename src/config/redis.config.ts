// src/config/redis.config.ts
import { registerAs } from '@nestjs/config';
import { Redis } from '@upstash/redis';

// Config NestJS pour Redis
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
}));

// Client Redis Upstash
export const redisClient = new Redis({
  url: process.env.REDIS_HOST,
  token: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
});

// Fonction d'initialisation async si nécessaire
export const initRedis = async () => {
  try {
    await redisClient.set('foo', 'bar');
    const val = await redisClient.get('foo');
    console.log('Redis test value:', val);
  } catch (err) {
    console.error('Redis initialization error:', err);
  }
};