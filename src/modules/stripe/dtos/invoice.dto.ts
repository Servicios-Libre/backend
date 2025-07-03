import { PaymentProvider } from '../../mercadopago/entities/PaymentProvider';
import { User } from '../../users/entities/users.entity';

export class InvoiceDto {
  id: number;
  externalReference: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  createdAt: string; // Formato yyyy-MM-dd para el frontend
  expiredAt: string;  // Formato yyyy-MM-dd para el frontend
  provider: PaymentProvider;
  user: User;
}
