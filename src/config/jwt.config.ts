import { JwtModule } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development.local' });

export const JwtConfig = JwtModule.register({
  global: true,
  signOptions: { expiresIn: '1h' },
  secret: process.env.JWT_SECRET,
});
