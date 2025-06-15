import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';
import { Request } from 'express';

@Controller('services')
export class WorkerServicesController {
  constructor(private readonly workerServicesService: WorkerServicesService) {}

  @Get()
  getAllServices(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('busqueda') search?: string,
    @Query('category') category?: string[],
  ) {
    const categories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : [];
    return this.workerServicesService.getAllServices(
      page,
      limit,
      search,
      categories,
    );
  }

  @Get('categories')
  getAllCategories() {
    return this.workerServicesService.getAllCategories();
  }

  @Post('new')
  createService(@Body() service: ServiceDto) {
    return this.workerServicesService.createService(service);
  }
}
