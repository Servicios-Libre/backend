import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Address } from './entities/address.entity';
import { Service } from '../workerServices/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Service])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
