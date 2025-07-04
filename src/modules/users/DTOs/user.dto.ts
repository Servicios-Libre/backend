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
   * Email del usuario.
   * Debe ser un string con formato de email válido.
   * @example example@gmail.com
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
   * Contraseña del usuario.
   * Debe tener entre 8 y 20 caracteres, al menos una mayúscula y un carácter especial.
   * @example Contra123@
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
   * Confirmación de la contraseña.
   * Debe coincidir con la contraseña ingresada.
   * @example Contra123@
   */
  @IsNotEmpty({
    message: 'Debe haber una confirmación de contraseña',
  })
  @IsString({
    message: 'La confirmación de contraseña debe ser un string',
  })
  confirmPassword: string;

  /**
   * Nombre del usuario.
   * Solo letras y espacios, máximo 20 caracteres.
   * @example Nombre
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
   * Teléfono del usuario.
   * String de hasta 20 caracteres.
   * @example 03436569569
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

  /**
   * Rol del usuario (no debe ser incluido en el body).
   * Oculto en Swagger.
   */
  @ApiHideProperty()
  @IsEmpty({
    message: 'No debe haber un rol',
  })
  role: Role;

  /**
   * Indica si el usuario es premium (no debe ser incluido en el body).
   * Oculto en Swagger.
   */
  @ApiHideProperty()
  @IsEmpty({ message: 'No debe haber un premium' })
  premium: boolean;

  /**
   * Calle del domicilio del usuario.
   * Solo letras y espacios, máximo 20 caracteres.
   * @example Calle Falsa
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
   * Número de casa del usuario.
   * Entero entre 1 y 10000.
   * @example 123
   */
  @IsNotEmpty({
    message: 'Debe haber un número de casa',
  })
  @IsInt({ message: 'El número de casa debe ser un número entero' })
  @Min(1, { message: 'El número de casa debe ser mayor a 0' })
  @Max(10000, { message: 'El número de casa debe ser menor a 10000' })
  house_number: number;

  /**
   * Ciudad del usuario.
   * Solo letras y espacios, máximo 20 caracteres.
   * @example Gran Ciudad
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
   * Provincia del usuario.
   * Solo letras y espacios, máximo 20 caracteres.
   * @example Gran Provincia
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
   * Código postal del usuario.
   * String de hasta 7 caracteres.
   * @example E3100
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
