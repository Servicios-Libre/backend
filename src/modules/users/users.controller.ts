import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('byId')
  GetUserById(@Headers('authorization') token: string) {
    return this.usersService.GetUserById(token);
  }
}
