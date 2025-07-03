import { Invoice } from '../../mercadopago/entities/factura.entity';
import { InvoiceDto } from './invoice.dto';

export class InvoiceMapper {
  static toDto(invoice: Invoice): InvoiceDto {
    return {
      id: invoice.id,
      externalReference: invoice.externalReference,
      amount: invoice.amount,
      paymentMethod: invoice.paymentMethod,
      paymentType: invoice.paymentType,
      createdAt: invoice.createdAt.toISOString().split('T')[0], // yyyy-MM-dd
      expiredAt: invoice.expiredAt.toISOString().split('T')[0],  // yyyy-MM-dd
      provider: invoice.provider,
      user: {
        id: invoice.user.id,
        name: invoice.user.name,
        email: invoice.user.email,
      },
    };
  }

  static toDtoArray(invoices: Invoice[]): InvoiceDto[] {
    return invoices.map(invoice => this.toDto(invoice));
  }
}
