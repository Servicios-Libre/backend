import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware raw para webhook Stripe
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Servicios Libres')
    .setVersion('1.0.0')
    .setDescription(
      'Documentación de rutas y ejemplos del back de Servicios Libres',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
