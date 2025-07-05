import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Servicio Libre')
  .setVersion('1.0.0-custom-ui')
  .setDescription(
    'Documentación de rutas y ejemplos del back de Servicio Libre',
  )
  .addBearerAuth()
  .build();
