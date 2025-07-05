import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('')
  .setVersion('1.0.0-custom-ui')
  .setDescription(
    'Documentación de rutas y ejemplos del back de Servicio Libre',
  )
  .addBearerAuth()
  .addTag('👩‍🔧 Usuarios')
  .addTag('🔒 Autenticación')
  .addTag('🛠 Servicios')
  .addTag('📷 Imágenes')
  .addTag('📋 Tickets')
  .addTag('⭐ Reseñas')
  .addTag('💬 Chat')
  .addTag('💳 Stripe')
  .addTag('💳 Mercado Pago')
  .build();
