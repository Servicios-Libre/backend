import { Controller, Get, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketStatus, TicketType } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Get()
  getTickets(
    @Query('type') type?: TicketType,
    @Query('status') status?: TicketStatus,
  ) {
    return this.ticketsService.getTickets(type, status);
  }
}
