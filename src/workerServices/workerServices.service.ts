import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "./entities/service.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkerServicesService {
    constructor(
      @InjectRepository(Service)
      private servicesRepository: Repository<Service>
    ) {};

    async getAllServices() {
        return await this.servicesRepository.find();
    };

    async createService(service) {
        const newService = this.servicesRepository.create(service);

        await this.servicesRepository.save(newService);

        return newService;
    }
}
