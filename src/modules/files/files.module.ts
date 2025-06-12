import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkPhoto } from '../workerServices/entities/workPhoto.entity';
import { Service } from '../workerServices/entities/service.entity';
import { FilesController } from './files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkPhoto, Service])],
  controllers: [FilesController],
  providers: [CloudinaryConfig, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
