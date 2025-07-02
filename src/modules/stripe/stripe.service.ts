/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
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
  ) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    if (!secretKey) throw new Error('Stripe secret key not found');
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
    console.log('Endpoint Secret:', endpointSecret);
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
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const status = subscription.status;

    console.log('entro al update');

    this.logger.log(
      `Subscription for customer ${customerId} changed status to ${status}`,
    );

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      this.logger.warn(`User with stripeCustomerId ${customerId} not found`);
      return;
    }

    user.premium = status === 'active' || status === 'trialing';
    await this.userRepository.save(user);
    console.log(`User ${user.id} premium status updated to ${user.premium}`);
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    this.logger.log(`Subscription deleted for customer ${customerId}`);

    const user = await this.userRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      this.logger.warn(`User with stripeCustomerId ${customerId} not found`);
      return;
    }

    user.premium = false;
    await this.userRepository.save(user);
  }
}
