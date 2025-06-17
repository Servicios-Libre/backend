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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      servicios: services,
      total,
    };
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.find();
    if (!categories) throw new NotFoundException('Categories not found');
    return categories;
  }

  async createService(service: ServiceDto) {
    const { category, worker_id, ...serviceKeys } = service;

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

    await this.ticketsService.createServiceTicket(serviceDB, workerFound);

    return serviceDB;
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
