import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('services')
export class WorkerServicesController {
  constructor(private readonly workerServicesService: WorkerServicesService) {}

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker', 'admin')
  @Get('worker/all/:id')
  getAllServicesByWorkerId(@Param('id') id: string) {
    return this.workerServicesService.getAllServicesByWorkerId(id);
  }

  @Get('worker/:id')
  getServicesByWorkerId(@Param('id') id: string) {
    return this.workerServicesService.getServicesByWorkerId(id);
  }

  @Get('categories')
  getAllCategories() {
    return this.workerServicesService.getAllCategories();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Post('new')
  createService(@Body() service: ServiceDto) {
    return this.workerServicesService.createService(service);
  }
}
