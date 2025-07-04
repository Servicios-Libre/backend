import {
  IsEmail,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Role } from '../entities/roles.enum';
import { ApiHideProperty } from '@nestjs/swagger';

export class UserDto {
  /**
  @example example@gmail.com
  */
  @IsNotEmpty({
    message: 'Debe haber un email',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsString({
    message: 'El email debe ser un string',
  })
  email: string;

  /**
  @example Contra123@
  */
  @IsNotEmpty({
    message: 'Debe haber una contraseña',
  })
  @IsString({
    message: 'La contraseña debe ser un string',
  })
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'La contraseña debe tener al menos un carácter especial',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe tener al menos una letra mayúscula',
  })
  password: string;

  /**
  @example Contra123@
  */
  @IsNotEmpty({
    message: 'Debe haber una confirmación de contraseña',
  })
  @IsString({
    message: 'La confirmación de contraseña debe ser un string',
  })
  confirmPassword: string;

  /**
  @example Nombre
  */
  @IsNotEmpty({
    message: 'Debe haber un nombre',
  })
  @IsString({
    message: 'El nombre debe ser un string',
  })
  @MaxLength(20, {
    message: 'El nombre debe tener menos de 20 caracteres',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'El nombre debe tener solo letras y espacios',
  })
  name: string;

  /**
  @example 03436569569
  */
  @IsNotEmpty({
    message: 'Debe haber un teléfono',
  })
  @IsString({
    message: 'El teléfono debe ser un string',
  })
  @MaxLength(20, {
    message: 'El teléfono debe tener menos de 20 caracteres',
  })
  phone: string;

  @ApiHideProperty()
  @IsEmpty({
    message: 'No debe haber un rol',
  })
  role: Role;

  @ApiHideProperty()
  @IsEmpty({ message: 'No debe haber un premium' })
  premium: boolean;

  /**
  @example Calle Falsa
  */
  @IsNotEmpty({
    message: 'Debe haber una calle',
  })
  @IsString({
    message: 'La calle debe ser un string',
  })
  @MaxLength(20, { message: 'La calle debe tener menos de 20 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'La calle debe tener solo letras y espacios',
  })
  street: string;

  /**
  @example 123
  */
  @IsNotEmpty({
    message: 'Debe haber un número de casa',
  })
  @IsInt({ message: 'El número de casa debe ser un número entero' })
  @Min(1, { message: 'El número de casa debe ser mayor a 0' })
  @Max(10000, { message: 'El número de casa debe ser menor a 10000' })
  house_number: number;

  /**
  @example Gran Ciudad
  */
  @IsNotEmpty({
    message: 'Debe haber una ciudad',
  })
  @IsString({
    message: 'La ciudad debe ser un string',
  })
  @MaxLength(20, { message: 'La ciudad debe tener menos de 20 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'La ciudad debe tener solo letras y espacios',
  })
  city: string;

  /**
  @example Gran Provincia
  */
  @IsNotEmpty({
    message: 'Debe haber una provincia',
  })
  @IsString({
    message: 'La provincia debe ser un string',
  })
  @MaxLength(20, { message: 'La provincia debe tener máximo 20 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'La provincia debe tener solo letras y espacios',
  })
  state: string;

  /**
  @example E3100
  */
  @IsNotEmpty({
    message: 'Debe haber un código postal',
  })
  @IsString({
    message: 'El código postal debe ser un string',
  })
  @MaxLength(7, { message: 'El código postal debe tener máximo 7 caracteres' })
  zip_code: string;
}
