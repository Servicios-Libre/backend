import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "./entities/service.entity";
import { Repository } from "typeorm";
import { ServiceDto } from "./dtos/service.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class WorkerServicesService {
    constructor(
      @InjectRepository(Service)
      private servicesRepository: Repository<Service>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>
    ) {};

    async getAllServices() {
        return await this.servicesRepository.find();
    };

    async getAllCategories() {
        return await this.categoryRepository.find();
    };

    async createService(service: ServiceDto) {
        const {category, worker_id, ...serviceKeys} = service;

        const categoryFound = await this.categoryRepository.findOneBy({name: category});
        if (!categoryFound) throw new NotFoundException(`Category ${category} not found`);

        const newService = this.servicesRepository.create({...serviceKeys, category: categoryFound});
        await this.servicesRepository.save(newService);

        return newService;
    }
}
