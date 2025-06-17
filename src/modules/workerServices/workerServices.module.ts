import { Module } from '@nestjs/common';
import { WorkerServicesController } from './workerServices.controller';
import { WorkerServicesService } from './workerServices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Category } from './entities/category.entity';
import { User } from '../users/entities/users.entity';
import { FilesService } from '../files/files.service';
import { WorkPhoto } from './entities/workPhoto.entity';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/entities/tickets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Category, User, WorkPhoto, Ticket]),
  ],
  controllers: [WorkerServicesController],
  providers: [WorkerServicesService, FilesService, TicketsService],
})
export class WorkerServicesModule {}
