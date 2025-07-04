import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ServiceDto {
  /**
  @example 123e4567-e89b-12d3-a456-426614174000
  */
  @IsNotEmpty({ message: 'El id del trabajador es obligatorio.' })
  @IsString({ message: 'El id del trabajador debe ser un string.' })
  @IsUUID(undefined, { message: 'El id del trabajador debe ser un UUID.' })
  worker_id: string;

  /**
  @example Ventas
  */
  @IsNotEmpty({ message: 'La categoria es obligatoria.' })
  @IsString({ message: 'La categoria debe ser un string.' })
  category: string;

  /**
  @example Servicio de prueba
  */
  @IsNotEmpty({ message: 'El titulo es obligatorio.' })
  @IsString({ message: 'El titulo debe ser un string.' })
  @Length(5, 50, { message: 'El titulo debe tener entre 5 y 50 caracteres.' })
  title: string;

  /**
  @example Este es un servicio de prueba
  */
  @IsNotEmpty({ message: 'La descripcion es obligatoria.' })
  @IsString({ message: 'La descripcion debe ser un string.' })
  @Length(5, 300, {
    message: 'La descripcion debe tener entre 5 y 300 caracteres.',
  })
  description: string;
}
