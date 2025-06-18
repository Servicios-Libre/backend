import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('byId')
  @UseGuards(AuthGuard('jwt'))
  GetUserById(@Req() req: Request) {
    if (!req.user?.id)
      throw new UnauthorizedException(
        'No se encontró el ID del usuario en la solicitud',
      );

    return this.usersService.GetUserById(req.user.id);
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  UpdateUser(@Req() req: Request, @Body() body: Partial<User>) {
    if (!req.user?.id)
      throw new UnauthorizedException(
        'No se encontró el ID del usuario en la solicitud',
      );

    return this.usersService.UpdateUser(req.user.id, body);
  }
}
