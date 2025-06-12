import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { WorkPhoto } from '../entities/workPhoto.entity';

export class ServiceDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  worker_id: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  work_photo: Partial<WorkPhoto[]>;
}
