import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class ReviewDto {
  /**
   * Descripción de la reseña.
   * Debe ser un texto entre 20 y 400 caracteres.
   * @example "El servicio fue excelente, muy profesional y puntual."
   */
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(20, 400, {
    message: 'La descripción debe tener entre 20 y 400 caracteres',
  })
  description: string;

  /**
   * Calificación otorgada en la reseña.
   * Debe ser un número entero entre 0 y 5.
   * @example 5
   */
  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(5, { message: 'La calificación máxima es 5' })
  rate: number;

  /**
   * ID del contrato asociado a la reseña.
   * Debe ser un string.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty({ message: 'El ID del contrato es obligatorio' })
  @IsString({ message: 'El ID del contrato debe ser un texto' })
  @IsUUID(undefined, { message: 'El ID del contrato debe ser un UUID' })
  contractId: string;
}
