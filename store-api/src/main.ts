import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields from the body
      forbidNonWhitelisted: true, // 400s on unexpected fields (typos caught!)
      transform: true, // converts payload into DTO class instances
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
