import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('services')
export class WorkerServicesController {
  constructor(private readonly workerServicesService: WorkerServicesService) {}

  @Get()
  getAllServices(
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Get('worker/:id')
  getServicesByWorkerId(@Query('id') id: string) {
    return this.workerServicesService.getServicesByWorkerId(id);
  }

  @Get('categories')
  getAllCategories() {
    return this.workerServicesService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post('new')
  createService(@Body() service: ServiceDto) {
    return this.workerServicesService.createService(service);
  }
}
