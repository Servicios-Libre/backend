import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/DTOs/user.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class CredentialsDto extends PickType(UserDto, ['email', 'password']) {}
