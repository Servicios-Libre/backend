import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';

@Controller('services')
export class WorkerServicesController {
  constructor(private readonly workerServicesService: WorkerServicesService) {}

  @Get()
  getAllServices(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: string,
  ) {
    return this.workerServicesService.getAllServices(page, limit, category);
  }

  @Get('categories')
  getAllCategories() {
    return this.workerServicesService.getAllCategories();
  }

  @Post('new')
  createService(@Body() service: ServiceDto) {
    console.log(service);

    return this.workerServicesService.createService(service);
  }
}
