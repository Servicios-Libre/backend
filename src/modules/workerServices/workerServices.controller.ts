import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Put,
  Delete,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';
import { EditServiceDto } from './dtos/edit-service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('🛠 Servicios')
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
  @UseGuards(JwtAuthGuard)
  @Post('new')
  createService(
    @Headers('authorization') token: string,
    @Body() service: ServiceDto,
  ) {
    return this.workerServicesService.createService(service, token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker')
  @Put('edit/:id')
  editService(@Param('id') id: string, @Body() body: EditServiceDto) {
    return this.workerServicesService.editService(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('worker', 'admin')
  @Delete('delete/:id')
  deleteService(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('authorization') token: string,
  ) {
    return this.workerServicesService.deleteService(id, token);
  }

  @ApiBearerAuth()
  @Get('premium')
  getAllServicesPremium() {
    return this.workerServicesService.getAllServicesPremium();
  }
}
