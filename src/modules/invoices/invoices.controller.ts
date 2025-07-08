import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('🖨 Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getAllInvoices(
    @Query('provider') provider?: 'stripe' | 'mercado_pago',
    @Query('year') year?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
  ) {
    const yearNumber = year ? parseInt(year, 10) : undefined;

    return this.invoicesService.getAllInvoices(
      Number(page),
      Number(limit),
      provider,
      yearNumber,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Get('worker')
  getInvoicesByUser(
    @Headers('Authorization') token: string,
    @Query('provider') provider?: 'stripe' | 'mercado_pago',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
  ) {
    return this.invoicesService.getInvoicesByUser(
      Number(page),
      Number(limit),
      token,
      provider,
    );
  }
}
