import { Body, Controller, Get, Post } from "@nestjs/common";
import { WorkerServicesService } from "./workerServices.service";

@Controller("services")
export class WorkerServicesController {
    constructor(
          private readonly workerServicesService: WorkerServicesService

    ) {}

    @Get()
    getAllServices() {
        return this.workerServicesService.getAllServices();
    };

    @Post('new')
    createService(@Body() service) {
        return this.workerServicesService.createService(service)
    }
}