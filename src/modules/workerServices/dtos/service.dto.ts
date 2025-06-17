import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

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
  @Length(5, 50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 300)
  description: string;
}
