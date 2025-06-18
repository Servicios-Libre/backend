import { IsEmail, IsEmpty, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../entities/roles.enum';

export class UserDto {
  /**
  @example example@gmail.com
  */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
  @example Password123
  */
  @IsNotEmpty()
  @IsString()
  password: string;

  /**
  @example Password123
  */
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  /**
  @example Nombre
  */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
  @example 03436569569
  */
  @IsNotEmpty()
  @IsInt()
  phone: number;

  @IsEmpty()
  role: Role;

  /**
  @example Calle-Falsa
  */
  @IsNotEmpty()
  @IsString()
  street: string;

  /**
  @example 123
  */
  @IsNotEmpty()
  @IsInt()
  house_number: number;

  /**
  @example Gran-Ciudad
  */
  @IsNotEmpty()
  @IsString()
  city: string;

  /**
  @example Gran-Pais
  */
  @IsNotEmpty()
  @IsString()
  state: string;

  /**
  @example E3100
  */
  @IsNotEmpty()
  @IsString()
  zip_code: string;
}
