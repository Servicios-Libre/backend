import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mp.controller';
import { MercadoPagoService } from './mp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Invoice } from './entities/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Invoice])],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
