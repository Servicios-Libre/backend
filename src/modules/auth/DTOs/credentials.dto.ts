import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/DTOs/user.dto';

export class CredentialsDto extends PickType(UserDto, ['email', 'password']) {}
