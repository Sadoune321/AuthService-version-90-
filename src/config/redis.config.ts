import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_HOST,
  token: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
})

await redis.set("foo", "bar");
await redis.get("foo");