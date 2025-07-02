import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dtos/review.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post('/new/:id')
  createReview(
    @Param('id', ParseUUIDPipe) worker_id: string,
    @Body() review: ReviewDto,
    @Headers('Authorization') token: string,
  ) {
    return this.reviewsService.createReview(worker_id, review, token);
  }

  @Get('random')
  getRandomReviews() {
    return this.reviewsService.getRandomReviews();
  }

  @Get(':id')
  getWorkerReviews(
    @Param('id', ParseUUIDPipe) worker_id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('sort') sort: 'recent' | 'oldest' | 'best' | 'worst' = 'recent',
  ) {
    return this.reviewsService.getWorkerReviews(worker_id, page, limit, sort);
  }
}
