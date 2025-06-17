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
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

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

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'The name can only contain letters (including accents) and spaces',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @IsEmpty()
  role: Role;

  @IsEmpty()
  premium: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message:
      'The address can only contain letters (including accents) and spaces',
  })
  street: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10000)
  house_number: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message: 'The city can only contain letters (including accents) and spaces',
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, {
    message:
      'The state can only contain letters (including accents) and spaces',
  })
  state: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  zip_code: string;
}
