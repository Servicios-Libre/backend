import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, In, Repository } from 'typeorm';
import { ServiceDto } from './dtos/service.dto';
import { Category } from './entities/category.entity';
import * as data from './data/categories.json';
import { User } from '../users/entities/users.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class WorkerServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async getAllServices(
    page: number = 1,
    limit: number = 8,
    search?: string,
    category?: string[],
  ) {
    const where: any = {};

    // Si hay categorías, filtra por ellas
    if (category && category.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.category = { id: In(category) };
    }

    // Si hay búsqueda, filtra por título que contenga el string (case-insensitive)
    if (search && search.trim() !== '') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.title = ILike(`%${search}%`);
    }

    // Obtener todos los servicios que cumplen el filtro (sin paginar)
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
