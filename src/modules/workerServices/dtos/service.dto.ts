import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
}
