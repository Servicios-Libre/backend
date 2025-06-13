import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ServiceDto } from './dtos/service.dto';
import { Category } from './entities/category.entity';
import * as data from './data/categories.json';
import { User } from '../users/entities/users.entity';

@Injectable()
export class WorkerServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllServices(page: number = 1, limit: number = 5, category?: string) {
    const categoryFound = await this.categoryRepository.findOneBy({
      name: category,
    });
    if (!categoryFound) throw new NotFoundException('Category not found');

    let services: Service[];
    if (category) {
      services = await this.servicesRepository.find({
        relations: ['category', 'worker'],
        select: {
          worker: {
            id: true,
            name: true,
            email: true,
            user_pic: true,
            premium: true,
          },
        },
        where: {
          category: {
            name: category,
          },
        },
      });
      if (!services) throw new NotFoundException('Services not found');
    } else {
      services = await this.servicesRepository.find({
        relations: ['category', 'worker'],
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
      if (!services) throw new NotFoundException('Services not found');
    }
    const pagination = [...services].slice((page - 1) * limit, page * limit);
    return pagination;
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
    console.log(workerFound);
    if (!workerFound)
      throw new NotFoundException(`Worker ${worker_id} not found`);

    const newService = this.servicesRepository.create({
      ...serviceKeys,
      category: categoryFound,
      worker: workerFound,
    });
    await this.servicesRepository.save(newService);

    return newService;
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
