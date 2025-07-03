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
import { EmailService } from '../email/email.service';
import { Contract } from '../chat/entities/contract.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
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

    const contract = await this.contractRepository.findOne({
      where: {
        id: review.contractId,
        clientId: payload.id,
        workerId: worker_id,
        completed: true,
      },
    });

    if (!contract) {
      throw new BadRequestException(
        'No podés dejar una review hasta que el contrato esté completado.',
      );
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

    await this.emailService.receivedReviewEmail(
      workerFound,
      clientFound,
      newReview,
      new Date(),
    );

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

  async getRandomReviews() {
    const reviews = await this.reviewRepository.find({
      relations: ['author', 'worker'],
    });
    const randomReviews = reviews.sort(() => Math.random() - 0.5).slice(0, 6);
    return randomReviews;
  }

  async checkIfReviewExists(contractId: string, token: string) {
    const payload = ExtractPayload(token);

    const existingReview = await this.reviewRepository.findOne({
      where: {
        contract: { id: contractId },
        author: { id: payload.id },
      },
      relations: ['contract', 'author'],
    });

    return { reviewExists: !!existingReview };
  }
}
