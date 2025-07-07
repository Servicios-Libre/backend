import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../mercadopago/entities/factura.entity';
import { Between, Repository } from 'typeorm';
import { ExtractPayload } from 'src/helpers/extractPayload.token';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
  ) {}

  async getAllInvoices(
    page: number = 1,
    limit: number = 6,
    provider?: 'stripe' | 'mercado_pago',
    year?: number,
  ) {
    const where: any = {};
    if (provider === 'mercado_pago' || provider === 'stripe') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.provider = provider;
    }

    if (
      year &&
      (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10)
    ) {
      throw new Error('El parámetro "year" debe ser un año válido');
    }

    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.createdAt = Between(startOfYear, endOfYear);
    }

    const [invoicesDB, total] = await this.invoiceRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['user', 'user.address_id', 'user.social'],
      select: {
        user: {
          password: false,
        },
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log(page, limit);

    const invoices = invoicesDB.map((invoice) => {
      return {
        ...invoice,
        createdAt: invoice.createdAt.toISOString().split('T')[0],
        updatedAt: invoice.expiredAt.toISOString().split('T')[0],
      };
    });

    const totalPages = Math.ceil(total / limit);
    return { invoices, total, totalPages, currentPage: page, limit };
  }

  async getInvoicesByUser(
    page: number,
    limit: number,
    token: string,
    provider?: 'stripe' | 'mercado_pago',
  ) {
    const { id } = ExtractPayload(token);
    const where: any = { user: { id } };

    if (provider === 'stripe' || provider === 'mercado_pago') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.provider = provider;
    }

    console.log(page, limit);

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    return { invoices, total, totalPages, currentPage: page, limit };
  }
}
