// src/config/redis.client.ts
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,

  tls: {}, // ✅ مهم لـ Upstash

  maxRetriesPerRequest: null, // ✅ يمنع crash
  retryStrategy: (times) => Math.min(times * 50, 2000), // ✅ retry ذكي
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

export default redisClient;