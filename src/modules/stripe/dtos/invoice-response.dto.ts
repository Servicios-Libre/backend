

import { InvoiceDto } from './invoice.dto';

export class InvoiceListResponseDto {
  invoices: InvoiceDto[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
