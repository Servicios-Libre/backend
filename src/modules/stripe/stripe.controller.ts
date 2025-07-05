import {
  Body,
  Controller,
  Headers,
  Post,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response, Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ExtractPayload } from 'src/helpers/extractPayload.token';
import { PaymentProvider } from '../mercadopago/entities/PaymentProvider';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../users/entities/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface AuthRequest extends ExpressRequest {
  user: any;
}

@ApiTags('💳 Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutJson(
    @Body('lookup_key') lookup_key: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = req.user;
    const url = await this.stripeService.createCheckoutSession(
      lookup_key,
      user,
    );

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('invoices')
  async getInvoices(
    @Query('provider') provider?: string,
    @Query('year') year?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      let paymentProvider: PaymentProvider | undefined;

      if (provider) {
        if (provider === 'stripe') {
          paymentProvider = PaymentProvider.STRIPE;
        } else if (provider === 'mercado_pago') {
          paymentProvider = PaymentProvider.MERCADO_PAGO;
        } else {
          throw new Error('Proveedor inválido. Use "stripe" o "mercado_pago"');
        }
      }

      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 6;
      const yearNumber = year ? parseInt(year, 10) : undefined;

      // Validar que page y limit sean números válidos
      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error('El parámetro "page" debe ser un número mayor a 0');
      }

      if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
        throw new Error(
          'El parámetro "limit" debe ser un número entre 1 y 100',
        );
      }

      // Validar año si se proporciona
      if (
        year &&
        (isNaN(yearNumber!) ||
          yearNumber! < 1900 ||
          yearNumber! > new Date().getFullYear() + 10)
      ) {
        throw new Error('El parámetro "year" debe ser un año válido');
      }

      const result = await this.stripeService.getAllInvoices(
        paymentProvider,
        yearNumber,
        pageNumber,
        limitNumber,
      );
      return result;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Error al obtener facturas: ${error.message}`);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('invoices/user')
  async getUserInvoices(
    @Headers('authorization') authorization: string,
    @Query('provider') provider?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const payload = ExtractPayload(authorization);
      const userId = payload?.id;

      if (!userId) {
        throw new Error('Token inválido o usuario no autenticado');
      }

      let paymentProvider: PaymentProvider | undefined;

      if (provider) {
        if (provider === 'stripe') {
          paymentProvider = PaymentProvider.STRIPE;
        } else if (provider === 'mercado_pago') {
          paymentProvider = PaymentProvider.MERCADO_PAGO;
        } else {
          throw new Error('Proveedor inválido. Use "stripe" o "mercado_pago"');
        }
      }

      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 6;

      // Validar que page y limit sean números válidos
      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error('El parámetro "page" debe ser un número mayor a 0');
      }

      if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
        throw new Error(
          'El parámetro "limit" debe ser un número entre 1 y 100',
        );
      }

      const result = await this.stripeService.getAllInvoicesForUserById(
        userId,
        paymentProvider,
        pageNumber,
        limitNumber,
      );
      return result;
    } catch (error) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener facturas del usuario: ${error.message}`,
      );
    }
  }
}
