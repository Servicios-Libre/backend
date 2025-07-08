import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SocialDto {
  /**
   * URL del perfil de Facebook del usuario.
   * Debe ser una URL válida.
   * Opcional.
   * Si la solicitud es PUT y no se incluye esta propiedad en el body, se eliminará (quedará en null) en la base de datos.
   * @example https://facebook.com/usuario
   */
  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  facebook: string;

  /**
   * URL del perfil de X (Twitter) del usuario.
   * Debe ser una URL válida.
   * Opcional.
   * Si la solicitud es PUT y no se incluye esta propiedad en el body, se eliminará (quedará en null) en la base de datos.
   * @example https://x.com/usuario
   */
  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  x: string;

  /**
   * URL del perfil de Instagram del usuario.
   * Debe ser una URL válida.
   * Opcional.
   * Si la solicitud es PUT y no se incluye esta propiedad en el body, se eliminará (quedará en null) en la base de datos.
   * @example https://instagram.com/usuario
   */
  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  instagram: string;

  /**
   * URL del perfil de LinkedIn del usuario.
   * Debe ser una URL válida.
   * Opcional.
   * Si la solicitud es PUT y no se incluye esta propiedad en el body, se eliminará (quedará en null) en la base de datos.
   * @example https://linkedin.com/in/usuario
   */
  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  linkedin: string;
}
