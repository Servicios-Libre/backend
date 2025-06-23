import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserDto } from 'src/modules/users/DTOs/user.dto';

export class CredentialsDto extends PickType(UserDto, [
  'email',
  'password',
  'name',
]) {}

export class UpdateImageDto extends CredentialsDto {
  @IsOptional()
  Image?: string;
}
