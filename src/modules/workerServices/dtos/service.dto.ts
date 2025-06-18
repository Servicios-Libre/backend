import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ServiceDto {
  /**
  @example ASDGRgrdgdth5461321d
  */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  worker_id: string;

  /**
  @example Categoria1
  */
  @IsNotEmpty()
  @IsString()
  category: string;

  /**
  @example Servicio1
  */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
  @example Este-es-un-servicio-de-prueba
  */
  @IsNotEmpty()
  @IsString()
  description: string;
}
