import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dtos/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  getWorkerReviews(
    @Param('id', ParseUUIDPipe) worker_id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('sort') sort: 'recent' | 'oldest' | 'best' | 'worst' = 'recent',
  ) {
    return this.reviewsService.getWorkerReviews(worker_id, page, limit, sort);
  }

  @Post('/new/:id')
  createReview(
    @Param('id', ParseUUIDPipe) worker_id: string,
    @Body() review: ReviewDto,
    @Headers('Authorization') token: string,
  ) {
    return this.reviewsService.createReview(worker_id, review, token);
  }
}
