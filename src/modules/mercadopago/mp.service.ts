/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { JwtService } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { Invoice } from './entities/factura.entity';
import { PaymentProvider } from './entities/PaymentProvider';

dotenvConfig({ path: ['.env', '.env.development.local'] });

@Injectable()
export class MercadoPagoService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Invoice) private InvoiceRepository: Repository<Invoice>,
  ) {
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createOrder(data: any, authHeader) {
    const token = authHeader?.split(' ')?.[1];
    const decoded = this.jwtService.verify(token);
    const userId = decoded.id;
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: 'Suscripción Premium',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: 17000,
        },
      ],
      back_urls: {
        success: `${process.env.FRONT_URL}/worker-profile/${userId}`,
      },
      notification_url: `${process.env.BACKEND_URL}/payment/webhook`,
      metadata: {
        user_id: userId,
      },
    });
    return { init_point: preference.body.init_point };
  }

  async handleWebhook(req: any) {
    const query = req.query;

    if (query.type === 'payment') {
      const payment = await mercadopago.payment.findById(query['data.id']);
      const metadata = payment.body.metadata;
      const userId = metadata?.user_id;
      const user = await this.UserRepository.findOneBy({ id: userId });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      user.premium = true;
      await this.UserRepository.save(user);

      console.log('Usuario actualizado a premium:', user.id);
      const existingInvoice = await this.InvoiceRepository.findOneBy({
        externalReference: String(payment.body.id),
      });

      if (existingInvoice) {
        console.log('Factura ya registrada');
        return;
      } else {
        const createdAt = new Date(payment.body.date_approved);

        const expiredAt = new Date(createdAt);
        expiredAt.setMonth(expiredAt.getMonth() + 1);
        const invoice = this.InvoiceRepository.create({
          externalReference: String(payment.body.id),
          amount: payment.body.transaction_amount,
          paymentMethod: payment.body.payment_method_id,
          paymentType: payment.body.payment_type_id,
          user: user,
          createdAt,
          expiredAt,
          provider: PaymentProvider.MERCADO_PAGO,
        });
        await this.InvoiceRepository.save(invoice);
        console.log('Usuario actualizado a premium y factura creada:', {
          userId: user.id,
          invoiceId: invoice.id,
        });
      }
    }
  }
}
