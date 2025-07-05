import { readFileSync } from 'fs';
import { join } from 'path';
// import { customJs } from './custom-assets/custom';
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

const customfavIcon = join(
  process.cwd(),
  'src',
  'documentation',
  'swagger',
  'custom-assets',
  'favicon.ico',
);

export const swaggerUiOptions: SwaggerCustomOptions = {
  customCss,
  customSiteTitle: 'Servicio Libre API Documentation',
  customfavIcon,
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
