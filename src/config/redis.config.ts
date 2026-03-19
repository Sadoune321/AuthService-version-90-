import { registerAs } from '@nestjs/config';
import { Redis } from '@upstash/redis';

export default registerAs('redis', () => ({
  url: process.env.REDIS_REST_URL,
  token: process.env.REDIS_REST_TOKEN,
}));

export const redisClient = new Redis({
  url: process.env.REDIS_REST_URL!,
  token: process.env.REDIS_REST_TOKEN!,
});