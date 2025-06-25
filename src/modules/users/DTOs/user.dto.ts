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

export class UserDto {
  /**
  @example example@gmail.com
  */
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  /**
  @example Password123
  */
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'The password must have at least one special char',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'The password must have at least one uppercase letter',
  })
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
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'The name can only contain letters (including accents) and spaces',
  })
  name: string;

  /**
  @example 03436569569
  */
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @IsEmpty()
  role: Role;

  @IsEmpty()
  premium: boolean;

  /**
  @example Calle-Falsa
  */
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message:
      'The address can only contain letters (including accents) and spaces',
  })
  street: string;

  /**
  @example 123
  */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10000)
  house_number: number;

  /**
  @example Gran-Ciudad
  */
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'The city can only contain letters (including accents) and spaces',
  })
  city: string;

  /**
  @example Gran-Pais
  */
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message:
      'The state can only contain letters (including accents) and spaces',
  })
  state: string;

  /**
  @example E3100
  */
  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  zip_code: string;
}
