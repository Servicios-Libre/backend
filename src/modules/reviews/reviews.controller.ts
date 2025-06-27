import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

@Controller('reviews')
export class ReviewsController {
  constructor() {}

  @Get(':id')
  getWorkerReviews() {
    return 'No implementado';
  }

  @Post('/new/:id')
  createReview(
    @Param('id', ParseUUIDPipe) worker_id: string,
    @Body() review: any,
  ) {
    return 'No implementado';
  }
}
