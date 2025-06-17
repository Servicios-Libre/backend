import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketStatus, TicketType } from './entities/tickets.entity';
import { Repository } from 'typeorm';
import { Service } from '../workerServices/entities/service.entity';
import { User } from '../users/entities/users.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async createServiceTicket(
    service: Partial<Service>,
    worker: Partial<User>,
  ): Promise<void> {
    const today = new Date().toLocaleDateString('es-AR');

    const userTickets = await this.ticketRepository.find({
      where: {
        type: TicketType.SERVICE,
        user: { id: worker.id },
        status: TicketStatus.PENDING,
      },
    });

    if (userTickets.length > 3)
      throw new BadRequestException(
        'El maximo numero de tickets pendientes por usuario es 3',
      );

    const newTicket = this.ticketRepository.create({
      type: TicketType.SERVICE,
      user: worker,
      service: service,
      created_at: today,
    });

    await this.ticketRepository.save(newTicket);
  }
}
