import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ServiceDto {
  /**
   * ID de worker UUID
   */
  /**
  @example 123e4567-e89b-12d3-a456-426614174000
  */
  @IsNotEmpty({ message: 'El id del trabajador es obligatorio.' })
  @IsString({ message: 'El id del trabajador debe ser un string.' })
  @IsUUID(undefined, { message: 'El id del trabajador debe ser un UUID.' })
  worker_id: string;

  /**
   * Categoria válida de las siguientes: Agricultura, Ventas, Fitness, Desarrollo Web, Marketing Digital, Salud, Desarrollo personal, Estética, Reparación.
   */
  /**
  @example Ventas
  */
  @IsNotEmpty({ message: 'La categoria es obligatoria.' })
  @IsString({ message: 'La categoria debe ser un string.' })
  category: string;

  /**
   * Titulo de entre 5 a 50 caracteres
   */
  /**
  @example Servicio de prueba
  */
  @IsNotEmpty({ message: 'El titulo es obligatorio.' })
  @IsString({ message: 'El titulo debe ser un string.' })
  @Length(5, 50, { message: 'El titulo debe tener entre 5 y 50 caracteres.' })
  title: string;

  /**
   * Descripcion de entre 5 a 300 caracteres
   */
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
