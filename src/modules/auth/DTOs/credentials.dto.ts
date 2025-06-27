import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Para login manual con email + password
 */
export class CredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * Para login con Google. Incluye:
 * - Email
 * - Name
 * - Imagen (opcional)
 */
export class UpdateImageDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}
