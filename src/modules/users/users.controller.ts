import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('byId')
  GetUserById(@Headers('authorization') token: string) {
    return this.usersService.GetUserById(token);
  }

  @Post('update')
  UpdateUser(
    @Headers('authorization') token: string,
    @Body() body: Partial<User>,
  ) {
    return this.usersService.UpdateUser(token, body);
  }
}
