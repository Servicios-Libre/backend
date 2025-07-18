import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/users.entity';
import { EmailService } from '../email/email.service';
import { Contract } from '../chat/entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Contract])],
  controllers: [ReviewsController],
  providers: [ReviewsService, EmailService],
})
export class ReviewsModule {}
