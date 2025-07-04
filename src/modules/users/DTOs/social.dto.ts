import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SocialDto {
  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  facebook: string;

  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  x: string;

  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  instagram: string;

  @IsOptional()
  @IsString({ message: 'El valor debe ser una cadena de texto' })
  @MinLength(1, { message: 'El valor debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El valor no debe exceder los 255 caracteres' })
  @IsUrl({}, { message: 'El valor debe ser una URL válida' })
  linkedin: string;
}
