import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Address } from './entities/address.entity';
import { Service } from '../workerServices/entities/service.entity';
import { Social } from './entities/social.entity';
import { State } from './entities/state.entity';
import { City } from './entities/cities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Service, Social, State, City]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
