import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "./entities/service.entity";
import { Repository } from "typeorm";
import { ServiceDto } from "./dtos/service.dto";
import { Category } from "./entities/category.entity";
import * as data from "./data/categories.json"
import { User } from "../users/entities/users.entity";

@Injectable()
export class WorkerServicesService {
    constructor(
      @InjectRepository(Service)
      private servicesRepository: Repository<Service>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
      @InjectRepository(User)
      private userRepository: Repository<User>
    ) {};

    async getAllServices() {
        const services = await this.servicesRepository.find();
        if (!services) throw new NotFoundException('Services not found');
        return services;
    };

    async getAllCategories() {
        const categories = await this.categoryRepository.find();
        if (!categories) throw new NotFoundException('Categories not found');
        return categories;
    };

    async createService(service: ServiceDto) {
        const {category, worker_id, ...serviceKeys} = service;

        const categoryFound = await this.categoryRepository.findOneBy({name: category});
        if (!categoryFound) throw new NotFoundException(`Category ${category} not found`);

        const workerFound = await this.userRepository.findOneBy({id: worker_id});
        if (!workerFound) throw new NotFoundException(`Worker ${worker_id} not found`);
        
        const newService = this.servicesRepository.create({...serviceKeys, category: categoryFound, worker: workerFound});
        await this.servicesRepository.save(newService);

        return newService;
    }

    async seedCategories() {
        data?.forEach(async (category) => {
            const newCategory = this.categoryRepository.create({name: category.name});
            await this.categoryRepository.save(newCategory);
        });
        return {message: "Categories seeded successfully"}
    }
}
