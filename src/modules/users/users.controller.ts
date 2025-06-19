import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from './entities/roles.enum';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: Role,
  ) {
    return this.usersService.getAllUsers(page, limit, role);
  }

  @Get('byId')
  GetUserById(@Headers('authorization') token: string) {
    return this.usersService.GetUserById(token);
  }

  @Put('update')
  UpdateUser(
    @Headers('authorization') token: string,
    @Body() body: Partial<User>,
  ) {
    return this.usersService.UpdateUser(token, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('to-worker/:id')
  userToWorker(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.userToWorker(id);
  }
}
