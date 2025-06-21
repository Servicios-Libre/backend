import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class ContractDto {
  @IsNotEmpty()
  @IsUUID()
  workerId: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEmpty()
  startDate?: Date;

  @IsEmpty()
  endDate?: Date;

  @IsEmpty()
  status?: string;

  @IsNotEmpty()
  @IsNumber()
  payment: number;
}
