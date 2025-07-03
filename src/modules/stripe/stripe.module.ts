import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { User } from '../users/entities/users.entity';
import { Invoice } from '../mercadopago/entities/factura.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Invoice]),
  ],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
