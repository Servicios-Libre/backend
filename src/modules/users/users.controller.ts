import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from './entities/roles.enum';
import { SocialDto } from './DTOs/social.dto';
import { ApiHeader } from '@nestjs/swagger';

@ApiTags('👩‍🔧 Usuarios')
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
    @Query('search') search?: string,
  ) {
    return this.usersService.getAllUsers(page, limit, role, search);
  }

  @Get('byId')
  GetUserById(@Headers('authorization') token: string) {
    return this.usersService.GetUserById(token);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: false,
  })
  @Put('update')
  UpdateUser(
    @Headers('authorization') token: string,
    @Body() body: Partial<User>,
  ) {
    return this.usersService.UpdateUser(token, body);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: false,
  })
  @Post('social')
  createSocial(
    @Headers('authorization') token: string,
    @Body() socialLinks: SocialDto,
  ) {
    return this.usersService.createSocial(token, socialLinks);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: false,
  })
  @Put('social')
  updateSocial(
    @Headers('authorization') token: string,
    @Body() socialLinks: SocialDto,
  ) {
    return this.usersService.updateSocial(token, socialLinks);
  }

  @Get('states')
  getStates() {
    return this.usersService.getStates();
  }

  @Get('premium')
  getPremiumUsers() {
    return this.usersService.getPremiumUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('to-worker/:id')
  userToWorker(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.userToWorker(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('to-user/:id')
  workerToUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.workerToUser(id);
  }

  @Get('worker/:id')
  getWorkerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getWorkerById(id);
  }

  @Get('is-worker/:id')
  isWorker(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.isWorker(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('to-admin/:id')
  anyUserToAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.anyUserToAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('downgrade-admin/:id')
  downgradeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.downgradeAdmin(id);
  }
}
