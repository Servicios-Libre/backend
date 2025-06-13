import { Module } from '@nestjs/common';
import { WorkerServicesController } from './workerServices.controller';
import { WorkerServicesService } from './workerServices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Category } from './entities/category.entity';
import { User } from '../users/entities/users.entity';
import { FilesService } from '../files/files.service';
import { WorkPhoto } from './entities/workPhoto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Category, User, WorkPhoto])],
  controllers: [WorkerServicesController],
  providers: [WorkerServicesService, FilesService],
})
export class WorkerServicesModule {}
