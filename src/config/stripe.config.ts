import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
}));
