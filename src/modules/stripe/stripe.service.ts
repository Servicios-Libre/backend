/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { Invoice } from '../mercadopago/entities/factura.entity';
import { PaymentProvider } from '../mercadopago/entities/PaymentProvider';
import { InvoiceListResponseDto } from './dtos/invoice-response.dto';
import { InvoiceMapper } from './dtos/invoice.mapper';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: ['.env', '.env.development.local'] });

@Injectable()
export class StripeService {
  private stripe: Stripe;
  $FRONT_URL = process.env.FRONT_URL;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    if (!secretKey) throw new Error('Stripe secret key no encontrada');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCheckoutSession(lookup_key: string, user: any) {
    const userDB = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!userDB) throw new Error('Usuario no encontrado');

    let stripeCustomerId = userDB.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: userDB.email,
        name: userDB.name,
      });
      stripeCustomerId = customer.id;
      // Guardar en la base de datos
      userDB.stripeCustomerId = stripeCustomerId;
      await this.userRepository.save(userDB);
    }

    const prices = await this.stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      billing_address_collection: 'required',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.$FRONT_URL}/worker-profile/${userDB.id}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.$FRONT_URL}//worker-profile/${userDB.id}/?canceled=true`,
    };
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else {
      sessionParams.customer_email = userDB.email;
    }
    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return session.url;
  }

  async createPortalSession(session_id: string) {
    const checkoutSession =
      await this.stripe.checkout.sessions.retrieve(session_id);

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${this.$FRONT_URL}`,
    });

    return portalSession.url;
  }

  async handleWebhook(request: any, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!endpointSecret) {
      this.logger.error('Stripe webhook secret is not configured');
      throw new Error('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw err;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const status = subscription.status;

    this.logger.log(
      `Procesando actualización de suscripción - Cliente: ${customerId}, Estado: ${status}, ID de suscripción: ${subscription.id}`,
    );

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      this.logger.warn(
        `Usuario con stripeCustomerId ${customerId} no encontrado`,
      );
      return;
    }

    const newPremiumStatus = status === 'active' || status === 'trialing';

    // Solo actualizar si el estado cambió (idempotencia)
    if (user.premium === newPremiumStatus) {
      this.logger.log(
        `El usuario ${user.id} ya tiene el estado premium en ${newPremiumStatus}, no es necesario actualizar.`,
      );
      return;
    }

    this.logger.log(
      `Usuario ${user.id} (${user.email}) - Premium actual: ${user.premium}, Nuevo premium: ${newPremiumStatus}`,
    );

    user.premium = newPremiumStatus;
    await this.userRepository.save(user);

    this.logger.log(
      `El estado premium del usuario ${user.id} se actualizó correctamente a ${user.premium}`,
    );

    // Generar factura si la suscripción está activa
    if (newPremiumStatus && (status === 'active' || status === 'trialing')) {
      await this.createInvoiceFromSubscription(subscription, user);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    this.logger.log(`Suscripción eliminada para el cliente ${customerId}`);

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      this.logger.warn(
        `Usuario con stripeCustomerId ${customerId} no encontrado`,
      );
      return;
    }

    user.premium = false;
    await this.userRepository.save(user);
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    this.logger.log(`Sesión de pago completada: ${session.id}`);

    // Solo procesar si es una suscripción
    if (session.mode !== 'subscription') {
      this.logger.log(
        `La sesión de pago ${session.id} no es una suscripción, omitiendo`,
      );
      return;
    }

    // Si la sesión tiene una suscripción, obtenerla y procesarla
    if (session.subscription) {
      const subscription = await this.stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      await this.handleSubscriptionUpdated(subscription);
    } else {
      this.logger.warn(
        `La sesión de pago ${session.id} se completó pero no se encontró suscripción`,
      );
    }
  }

  private async createInvoiceFromSubscription(
    subscription: Stripe.Subscription,
    user: User,
  ) {
    try {
      // Verificar si ya existe una factura para esta suscripción
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { externalReference: subscription.id },
      });

      if (existingInvoice) {
        this.logger.log(
          `Ya existe una factura para la suscripción ${subscription.id}`,
        );
        return;
      }

      // Obtener el precio de la suscripción
      const subscriptionItem = subscription.items.data[0];
      const price = subscriptionItem.price;
      const amount = price.unit_amount ? price.unit_amount / 100 : 0; // Stripe maneja centavos

      // Calcular fecha de expiración basada en el intervalo de la suscripción
      const createdAt = new Date(subscription.created * 1000); // Stripe usa timestamps Unix
      const expiredAt = new Date(createdAt);

      // Agregar tiempo basado en el intervalo
      if (price.recurring?.interval === 'month') {
        expiredAt.setMonth(
          expiredAt.getMonth() + (price.recurring.interval_count || 1),
        );
      } else if (price.recurring?.interval === 'year') {
        expiredAt.setFullYear(
          expiredAt.getFullYear() + (price.recurring.interval_count || 1),
        );
      } else {
        // Default: 1 mes
        expiredAt.setMonth(expiredAt.getMonth() + 1);
      }

      // Crear la factura
      const invoice = this.invoiceRepository.create({
        externalReference: subscription.id,
        amount: amount,
        paymentMethod: 'stripe_subscription',
        paymentType: price.recurring?.interval || 'monthly',
        user: user,
        createdAt,
        expiredAt,
        provider: PaymentProvider.STRIPE,
      });

      await this.invoiceRepository.save(invoice);

      this.logger.log(
        `Factura creada para la suscripción ${subscription.id}, usuario ${user.id}, monto ${amount}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al crear la factura para la suscripción ${subscription.id}:`,
        error,
      );
    }
  }

  async getAllInvoicesForUserById(
    userId: string,
    provider?: PaymentProvider,
    page?: number,
    limit?: number,
  ): Promise<InvoiceListResponseDto> {
    const pageNumber = page ?? 1;
    const limitNumber = limit ?? 6;
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition: any = { user: { id: userId } };
    if (provider) {
      whereCondition.provider = provider;
    }

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip,
      take: limitNumber,
      relations: ['user'],
    });

    const totalPages = Math.ceil(total / limitNumber);

    return {
      invoices: InvoiceMapper.toDtoArray(invoices),
      total,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };
  }

  async getAllInvoices(
    provider?: PaymentProvider,
    year?: number,
    page?: number,
    limit?: number,
  ): Promise<InvoiceListResponseDto> {
    const pageNumber = page ?? 1;
    const limitNumber = limit ?? 6;
    const whereCondition: any = {};

    if (provider) {
      whereCondition.provider = provider;
    }

    if (year) {
      // Filtrar por año en la fecha de creación
      const startOfYear = new Date(year, 0, 1); // 1 de enero del año
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999); // 31 de diciembre del año

      whereCondition.createdAt = Between(startOfYear, endOfYear);
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: whereCondition,
      relations: ['user', 'user.address_id', 'user.social'],
      order: { createdAt: 'DESC' },
      skip,
      take: limitNumber,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return {
      invoices: InvoiceMapper.toDtoArray(invoices),
      total,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };
  }
}
