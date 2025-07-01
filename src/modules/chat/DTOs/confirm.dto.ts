import { Role } from '../../users/entities/roles.enum';
import { IsEnum } from 'class-validator';

export class ConfirmContractDto {
  @IsEnum(Role)
  role: Role;
}
