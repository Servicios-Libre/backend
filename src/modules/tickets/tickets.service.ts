/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketStatus, TicketType } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { Service } from '../workerServices/entities/service.entity';
import { User } from '../users/entities/users.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async getTickets(type?: TicketType, status?: TicketStatus) {
    if (type !== undefined && !Object.values(TicketType).includes(type))
      throw new BadRequestException('Invalid querys for type');
    if (status !== undefined && !Object.values(TicketStatus).includes(status))
      throw new BadRequestException('Invalid querys for status');
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (type === TicketType.SERVICE)
      return await this.ticketRepository.find({
        where,
        relations: ['service'],
      });

    return await this.ticketRepository.find({ where });
  }

  async checkServiceTicketLimit(user_id: string) {
    const userTickets = await this.ticketRepository.find({
      where: {
        type: TicketType.SERVICE,
        user: { id: user_id },
        status: TicketStatus.PENDING,
      },
    });

    if (userTickets.length > 3)
      throw new BadRequestException(
        'El maximo numero de tickets pendientes por usuario es 3',
      );
  }

  async createServiceTicket(
    service: Partial<Service>,
    worker: Partial<User>,
  ): Promise<Ticket> {
    const today = new Date().toLocaleDateString('es-AR');

    const newTicket = this.ticketRepository.create({
      type: TicketType.SERVICE,
      user: worker,
      service: service,
      created_at: today,
    });

    await this.ticketRepository.save(newTicket);

    return newTicket;
  }

  async rejectTicket(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.PENDING)
      throw new BadRequestException('Ticket is not pending');
    await this.ticketRepository.update(
      { id },
      { status: TicketStatus.REJECTED },
    );
    return { message: 'Ticket rejected' };
  }

  async acceptTicket(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.PENDING)
      throw new BadRequestException('Ticket is not pending');

    await this.ticketRepository.update(
      { id },
      { status: TicketStatus.ACCEPTED },
    );
    return { message: 'Ticket accepted' };
  }
}
