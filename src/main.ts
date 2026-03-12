import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = NestFactory.create(AppModule);

  // validation globale des DTOs
  (await app).useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await (await app).listen(process.env.PORT || 3000);
  console.log('🚀 AuthService running on port 3000');
}
bootstrap();