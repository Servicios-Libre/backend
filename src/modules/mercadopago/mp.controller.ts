import { Controller, Post, Get, Req, Res, Body, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { MercadoPagoService } from './mp.service';

@Controller('payment')
export class MercadoPagoController {
  constructor(private readonly paymentService: MercadoPagoService) {}

  @Post('create-order')
  async createOrder(
    @Body() body: any,
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.createOrder(body, authHeader);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return res.redirect(url.init_point);
  }

  @Get('success')
  success(@Res() res: Response) {
    return res.send('pago hecho');
  }

  @Post('webhook')
  async receiveWebhook(@Req() req: Request, @Res() res: Response) {
    await this.paymentService.handleWebhook(req);
    res.send('webhook recibido');
  }
}
