import { Body, Controller, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response, Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: any;
}

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // @Post('create-checkout-session')
  // async createCheckout(
  //   @Body('lookup_key') lookup_key: string,
  //   @Res() res: Response,
  // ) {
  //   const url = await this.stripeService.createCheckoutSession(lookup_key);

  //   if (!url) {
  //     return res
  //       .status(400)
  //       .json({ error: 'No se pudo crear la sesión de checkout de Stripe' });
  //   }

  //   return res.redirect(303, url);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutJson(
    @Body('lookup_key') lookup_key: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    
    const user = req.user;
    const url = await this.stripeService.createCheckoutSession(lookup_key, user);

    if (!url) {
      return res
        .status(400)
        .json({ error: 'No se pudo crear la sesión de checkout de Stripe' });
    }

    return res.status(200).json({ url });
  }

  @Post('create-portal-session')
  async createPortal(
    @Body('session_id') session_id: string,
    @Res() res: Response,
  ) {
    const url = await this.stripeService.createPortalSession(session_id);
    return res.redirect(303, url);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    try {
      await this.stripeService.handleWebhook(req, signature);
      return res.status(200).send({ received: true });
    } catch (err) {
      return res
        .status(400)
        .send(
          `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        );
    }
  }
}
