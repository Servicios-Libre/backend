import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Address } from '../users/entities/address.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
