import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, In, Repository } from 'typeorm';
import { ServiceDto } from './dtos/service.dto';
import { Category } from './entities/category.entity';
import * as data from './data/categories.json';
import { User } from '../users/entities/users.entity';
import { TicketsService } from '../tickets/tickets.service';
import { TicketStatus } from '../tickets/entities/ticket.entity';
import { EditServiceDto } from './dtos/edit-service.dto';
import { Payload } from '../auth/types/payload.type';
import { ExtractPayload } from 'src/helpers/extractPayload.token';

@Injectable()
export class WorkerServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly ticketsService: TicketsService,
  ) {}

  async getAllServices(
    page: number = 1,
    limit: number = 8,
    search?: string,
    category?: string[],
  ) {
    const where: any = {};

    if (category && category.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.category = { id: In(category) };
    }

    if (search && search.trim() !== '') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.title = ILike(`%${search}%`);
    }

    const [services, total] = await this.servicesRepository.findAndCount({
      relations: ['category', 'worker', 'work_photos', 'ticket'],
      // select: {
      //   worker: {
      //     id: true,
      //     name: true,
      //     email: true,
      //     user_pic: true,
      //     premium: true,
      //   },
      // },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { ...where, ticket: { status: 'accepted' } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      servicios: services,
      total,
    };
  }

  async getAllServicesByWorkerId(id: string) {
    const [services, total] = await this.servicesRepository.findAndCount({
      where: { worker: { id } },
      relations: ['ticket'],
      select: {
        ticket: {
          status: true,
        },
      },
    });

    if (total === 0) {
      throw new NotFoundException('No services found for this worker');
    }
    return {
      services,
      total,
    };
  }

  async getServicesByWorkerId(id: string) {
    const worker = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        user_pic: true,
      },
    });

    if (!worker) throw new NotFoundException('Trabajador no encontrado');

    const services = await this.servicesRepository.find({
      where: { worker: { id } },
      relations: ['ticket', 'category', 'work_photos'],
      select: {
        ticket: {
          status: true,
        },
      },
    });

    const cleanServices = services.filter(
      (service) => service.ticket.status === TicketStatus.ACCEPTED,
    );

    return {
      ...worker, // devuelve directamente { id, name, email, user_pic }
      services: cleanServices,
      total: cleanServices.length,
    };
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.find();
    if (!categories) throw new NotFoundException('Categories not found');
    return categories;
  }

  async createService(service: ServiceDto) {
    const { category, worker_id, ...serviceKeys } = service;

    await this.ticketsService.checkServiceTicketLimit(worker_id);

    const categoryFound = await this.categoryRepository.findOneBy({
      name: category,
    });
    if (!categoryFound)
      throw new NotFoundException(`Category ${category} not found`);

    const workerFound = await this.userRepository.findOneBy({ id: worker_id });
    if (!workerFound)
      throw new NotFoundException(`Worker ${worker_id} not found`);
    if (workerFound.role !== 'worker')
      throw new BadRequestException('Only workers can create services');

    const newService = this.servicesRepository.create({
      ...serviceKeys,
      category: categoryFound,
      worker: workerFound,
    });

    await this.servicesRepository.save(newService);

    const serviceDB = await this.servicesRepository.findOne({
      where: { id: newService.id },
      relations: ['category', 'worker', 'work_photos'],
      select: {
        worker: {
          id: true,
          name: true,
          email: true,
          user_pic: true,
          premium: true,
        },
      },
    });
    if (!serviceDB) throw new NotFoundException('Service not found');

    const ticket = await this.ticketsService.createServiceTicket(
      serviceDB,
      workerFound,
    );

    await this.servicesRepository.update(
      { id: serviceDB.id },
      { ticket: ticket },
    );

    return serviceDB;
  }

  async editService(serviceId: string, dto: EditServiceDto) {
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
      relations: ['worker', 'ticket'],
    });

    if (!service) throw new NotFoundException('Service not found');

    // validación: el servicio debe estar aceptado
    console.log(service.ticket.status);
    if (!service.ticket || service.ticket.status !== TicketStatus.ACCEPTED) {
      throw new BadRequestException('Only accepted services can be edited');
    }

    // Actualizá solo si hay cambios
    if (dto.title) service.title = dto.title;
    if (dto.description) service.description = dto.description;

    await this.servicesRepository.save(service);

    return {
      message: 'Service updated successfully',
      service,
    };
  }

  async deleteService(id: string, token: string) {
    const payload: Omit<Payload, 'name'> = ExtractPayload(token);

    if (!payload) throw new BadRequestException('Invalid token');

    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['worker', 'ticket'],
    });

    if (!service) throw new NotFoundException('Service not found');
    if (service.worker.id !== payload.id) {
      throw new BadRequestException(
        'Only the owner of the service can delete it',
      );
    }

    await this.servicesRepository.delete(id);

    return { message: 'Service deleted succesfully' };
  }

  async seedCategories() {
    const response = data?.map(async (category) => {
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(category)
        .orIgnore()
        .execute();
    });

    await Promise.all(response);

    return { message: 'Categories seeded successfully' };
  }
}
