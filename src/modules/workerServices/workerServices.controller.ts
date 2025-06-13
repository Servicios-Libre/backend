import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WorkerServicesService } from './workerServices.service';
import { ServiceDto } from './dtos/service.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image'))
  createService(
    @Body() service: ServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: 'El archivo debe ser menor a 2MB',
          }),
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {

    return this.workerServicesService.createService(service, file);
  }
}
