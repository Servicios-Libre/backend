// src/modules/workerServices/dtos/edit-service.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditServiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
