import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: process.env.FRONT_APP ?? 'http://localhost:3000',
    credentials: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
