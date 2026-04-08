import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService implements OnModuleInit {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in env');
    }

    
    this.client = new Redis(redisUrl);

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err) => console.error('Redis error:', err));

    await this.client.ping(); 
  }

 
  async createSession(userId: string, data: object, ttl: number = 604800): Promise<void> {
    await this.client.set(`session:${userId}`, JSON.stringify(data), 'EX', ttl);
    console.log(`Session created for userId: ${userId}`);
  }


  async getSession(userId: string): Promise<any | null> {
    const data = await this.client.get(`session:${userId}`);
    return data ? JSON.parse(data) : null;
  }

 
  async deleteSession(userId: string): Promise<void> {
    await this.client.del(`session:${userId}`);
    console.log(`Session deleted for userId: ${userId}`);
  }

  async sessionExists(userId: string): Promise<boolean> {
    const exists = await this.client.exists(`session:${userId}`);
    return exists === 1;
  }
}
