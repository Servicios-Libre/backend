/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketStatus, TicketType } from './entities/ticket.entity';
import { In, Repository } from 'typeorm';
import { Service } from '../workerServices/entities/service.entity';
import { User } from '../users/entities/users.entity';
import { EmailService } from '../email/email.service';
import { ExtractPayload } from 'src/helpers/extractPayload.token';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async getTickets(
    page: number,
    limit: number,
    type?: TicketType,
    status?: TicketStatus,
  ) {
    if (type !== undefined && !Object.values(TicketType).includes(type))
      throw new BadRequestException('Invalid querys for type');
    if (status !== undefined && !Object.values(TicketStatus).includes(status))
      throw new BadRequestException('Invalid querys for status');
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const skip = (page - 1) * limit;

    if (type === TicketType.SERVICE) {
      const total = await this.ticketRepository.count({ where });
      const tickets = await this.ticketRepository.find({
        where,
        relations: {
          user: true,
          service: {
            work_photos: true,
          },
        },
        select: {
          user: {
            name: true,
            email: true,
          },
        },
        skip,
        take: limit,
      });
      return {
        total,
        tickets: [...tickets],
      };
    }

    if (type === TicketType.TO_WORKER) {
      const total = await this.ticketRepository.count({ where });
      const tickets = await this.ticketRepository.find({
        where,
        relations: ['user'],
        select: {
          user: {
            id: true,
            name: true,
            email: true,
          },
        },
        skip,
        take: limit,
      });
      return {
        total,
        tickets: [...tickets],
      };
    }
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

    await this.emailService.newServiceTicketEmail(
      worker.email!,
      worker.name!,
      newTicket.id,
      worker.user_pic!,
      worker.id!,
    );
    return newTicket;
  }

  async createWorkerTicket(user_id: string, token: string) {
    const { id } = ExtractPayload(token);
    if (!id) throw new BadRequestException('Invalid token');
    if (id !== user_id)
      throw new UnauthorizedException(
        'Solo puedes crear un ticket para ti mismo',
      );

    const userFound = await this.userRepository.findOneBy({ id: user_id });
    if (!userFound) throw new NotFoundException('User not found');
    if (userFound.role !== 'user') {
      throw new BadRequestException(
        'Solo los usuarios pueden crear tickets para ser trabajadores',
      );
    }

    if (!userFound.user_pic)
      throw new BadRequestException('El usuario no tiene una foto de perfil');

    const userTickets = await this.ticketRepository.find({
      where: {
        type: TicketType.TO_WORKER,
        user: { id },
        status: In([TicketStatus.PENDING, TicketStatus.ACCEPTED]),
      },
    });

    if (userTickets.length >= 1) {
      throw new BadRequestException(
        'El usuario ya tiene un ticket en estado pendiente o aceptado',
      );
    }

    const today = new Date().toLocaleDateString('es-AR');

    const newTicket = this.ticketRepository.create({
      type: TicketType.TO_WORKER,
      user: userFound,
      created_at: today,
    });

    await this.ticketRepository.save(newTicket);
    await this.emailService.newWorkerTicketEmail(
      userFound.email,
      userFound.name,
      newTicket.id,
      userFound.user_pic,
    );
    return { message: 'Ticket created' };
  }

  async rejectTicket(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.PENDING)
      throw new BadRequestException('Ticket is not pending');
    await this.ticketRepository.update(
      { id },
      { status: TicketStatus.REJECTED },
    );
    console.log(ticket.user.email);
    await this.emailService.ticketRejectedEmail(
      ticket.user.email,
      ticket.user.name,
      ticket.user.user_pic!,
      ticket.id,
      ticket.type,
    );
    return { message: 'Ticket rejected' };
  }

  async acceptTicket(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: {
        user: true,
        service: {
          work_photos: true,
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status !== TicketStatus.PENDING)
      throw new BadRequestException('Ticket is not pending');
    if (ticket.type == TicketType.SERVICE && !ticket.service.work_photos)
      throw new BadRequestException('Service has no photos');
    if (ticket)
      await this.ticketRepository.update(
        { id },
        { status: TicketStatus.ACCEPTED },
      );
    await this.emailService.acceptedTicketEmail(
      ticket.user.email,
      ticket.user.name,
      ticket.id,
      ticket.type,
      ticket.user.user_pic!,
    );
    return { message: 'Ticket accepted' };
  }
}
