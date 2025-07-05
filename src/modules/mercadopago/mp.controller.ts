import { Controller, Post, Get, Req, Res, Body, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { MercadoPagoService } from './mp.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('💳 Mercado Pago')
@Controller('payment')
export class MercadoPagoController {
  constructor(private readonly paymentService: MercadoPagoService) {}

  @Post('create-order')
  async createOrder(
    @Body() body: any,
    @Headers('authorization') authHeader: string,
  ) {
    return this.paymentService.createOrder(body, authHeader);
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

  // @Get('byId')
  // getAllInvoices(@Headers('authorization') token: string) {
  //   return this.paymentService.getAllInvoiceService(token);
  // }
}
