import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { swaggerConfig } from './documentation/swagger/swagger.config';
import { swaggerUiOptions } from './documentation/swagger/swagger-ui.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware raw para webhook Stripe
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, swaggerUiOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
