import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initRedis } from './config/redis.config'; // <- importer la fonction

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ─── Initialisation Redis ───────────────────────────
  await initRedis();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`🚀 AuthService running on port ${process.env.PORT || 3000}`);
}
bootstrap();