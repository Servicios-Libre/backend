import {
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketStatus, TicketType } from './entities/ticket.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('📋 Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getTickets(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('type') type?: TicketType,
    @Query('status') status?: TicketStatus,
  ) {
    return this.ticketsService.getTickets(page, limit, type, status);
  }

  @UseGuards(JwtAuthGuard)
  // RolesGuard
  // @Roles('user')
  @Post('new/:id')
  async createWorkerTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('authorization') token: string,
  ) {
    return this.ticketsService.createWorkerTicket(id, token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('/reject/:id')
  rejectTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.rejectTicket(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('/accept/:id')
  acceptTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.acceptTicket(id);
  }
}
