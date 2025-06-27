import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Para login manual con email + password
 */
export class CredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

/**
 * Para login con Google. Incluye:
 * - Email
 * - Name
 * - Imagen (opcional)
 * - Password simbólica "Google@Auth"
 */
export class UpdateImageDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}
