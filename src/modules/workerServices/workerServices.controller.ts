import { Body, Controller, Get, Post } from "@nestjs/common";
import { WorkerServicesService } from "./workerServices.service";
import { ServiceDto } from "./dtos/service.dto";

@Controller("services")
export class WorkerServicesController {
    constructor(
          private readonly workerServicesService: WorkerServicesService

    ) {}

    @Get()
    getAllServices() {
        return this.workerServicesService.getAllServices();
    };

    @Get('categories')
    getAllCategories() {
        return this.workerServicesService.getAllCategories();
    };

    @Post('new')
    createService(@Body() service: ServiceDto) {
        return this.workerServicesService.createService(service)
    }
}