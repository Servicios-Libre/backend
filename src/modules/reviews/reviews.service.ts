/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/users.entity';
import { ReviewDto } from './dtos/review.dto';
import { ExtractPayload } from 'src/helpers/extractPayload.token';
import { Payload } from '../auth/types/payload.type';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Review) private userRepository: Repository<User>,
  ) {}

  async getWorkerReviews(
    worker_id: string,
    page: number,
    limit: number,
    sort: 'recent' | 'oldest' | 'best' | 'worst',
  ) {
    const order: any = {};

    if (sort === 'recent') {
      order.created_at = 'DESC';
    } else if (sort === 'oldest') {
      order.created_at = 'ASC';
    } else if (sort === 'best') {
      order.rate = 'DESC';
    } else if (sort === 'worst') {
      order.rate = 'ASC';
    }

    const workerFound = await this.userRepository.findOne({
      where: { id: worker_id },
    });

    if (!workerFound) {
      throw new NotFoundException('worker not found');
    }

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { worker: { id: worker_id } },
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author', 'worker'],
    });

    return {
      reviews,
      total,
    };
  }

  async createReview(worker_id: string, review: ReviewDto, token: string) {
    const payload: Omit<Payload, 'name'> = ExtractPayload(token);

    if (payload.role !== 'user') {
      throw new UnauthorizedException('you are not a client');
    }

    const clientFound = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!clientFound) {
      throw new NotFoundException('client not found');
    }

    const workerFound = await this.userRepository.findOne({
      where: { id: worker_id },
    });

    if (!workerFound) {
      throw new NotFoundException('worker not found');
    }

    const reviewFound = await this.reviewRepository.findOne({
      where: { worker: { id: worker_id }, author: { id: payload.id } },
    });

    if (reviewFound) {
      throw new BadRequestException(
        'you already have a review for this worker',
      );
    }

    const newReview = this.reviewRepository.create({
      ...review,
      worker: workerFound,
      author: clientFound,
    });
    await this.reviewRepository.save(newReview);

    await this.updateRate(worker_id);

    return { message: 'Review creada' };
  }

  private async updateRate(worker_id: string) {
    const workerFound = await this.userRepository.findOne({
      where: { id: worker_id },
    });
    if (!workerFound) {
      throw new NotFoundException('worker not found');
    }

    const reviews = await this.reviewRepository.find({
      where: { worker: { id: worker_id } },
    });

    const totalRate = reviews.reduce((acc, review) => {
      return acc + review.rate;
    }, 0);

    const averageRate = totalRate / reviews.length;

    workerFound.rate = averageRate;
    await this.userRepository.save(workerFound);
  }
}
