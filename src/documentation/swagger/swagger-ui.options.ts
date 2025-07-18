import { readFileSync } from 'fs';
import { join } from 'path';
import { SwaggerCustomOptions } from '@nestjs/swagger';

const customCss = readFileSync(
  join(
    process.cwd(),
    'src',
    'documentation',
    'swagger',
    'custom-assets',
    'custom.css',
  ),
  'utf8',
);

export const swaggerUiOptions: SwaggerCustomOptions = {
  customCss,
  customSiteTitle: 'Servicio Libre - API Documentation',
  customfavIcon:
    'https://res.cloudinary.com/dz6uvtewy/image/upload/v1751908858/favicon-w_noemoc.png',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
};
