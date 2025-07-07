import { Module } from '@nestjs/common';
import { Invoice } from '../mercadopago/entities/factura.entity';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
