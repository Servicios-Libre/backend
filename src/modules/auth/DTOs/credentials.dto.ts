import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Para login manual con email + password
 */
export class CredentialsDto {
  @IsNotEmpty({ message: 'Debe ingresar un email' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsNotEmpty({ message: 'Debe ingresar una contraseña' })
  @IsString({ message: 'La contraseña debe ser un string' })
  password: string;
}

/**
 * Para login con Google. Incluye:
 * - Email
 * - Name
 * - Imagen (opcional)
 */
export class UpdateImageDto {
  @IsNotEmpty({ message: 'Debe ingresar un email' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsNotEmpty({ message: 'Debe ingresar un nombre' })
  @IsString({ message: 'El nombre debe ser un string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser un string' })
  image?: string;
}
