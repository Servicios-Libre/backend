import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { ExtractPayload } from 'src/helpers/extractPayload.token';
import { Address } from './entities/address.entity';
import { Role } from './entities/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
  ) {}

  async getAllUsers(page = 1, limit = 10, role?: Role) {
    const where: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (role) where.role = role;
    const [users, total] = await this.UserRepository.findAndCount({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      users,
      total,
    };
  }

  async GetUserById(token: string) {
    const payload = ExtractPayload(token);
    const user = await this.UserRepository.findOne({
      where: { id: payload.id },
      relations: { address_id: true, tickets: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userClean } = user;
    return userClean;
  }

  async UpdateUser(token: string, body: Partial<User>) {
    const payload = ExtractPayload(token);
    const userID = payload.id;
    const userDB = await this.UserRepository.findOne({
      where: { id: userID },
      relations: ['address_id'],
    });
    if (!userDB) throw new NotFoundException('User not found');
    if (body.phone)
      await this.UserRepository.update({ id: userID }, { phone: body.phone });

    const addressActualization = {};
    for (const key in body) {
      if (body[key]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        if (key !== 'phone') addressActualization[key] = body[key];
      }
    }

    await this.AddressRepository.update(
      { id: userDB?.address_id.id },
      addressActualization,
    );
  }

  async userToWorker(id: string) {
    const user: User | null = await this.UserRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'worker')
      throw new BadRequestException('User is already a worker');
    await this.UserRepository.update(
      { id },
      { role: 'worker', availability: true },
    );

    return { message: 'User updated to worker' };
  }

  async getWorkerById(id: string) {
    const worker = await this.UserRepository.findOne({
      where: { id, role: 'worker' },
      relations: {
        address_id: true,
        services: {
          work_photos: true,
          category: true,
        },
      },
      select: {
        id: true,
        name: true,
        rate: true,
        user_pic: true,
        premium: true,
        email: true,
        phone: true,
        availability: true,
        address_id: {
          id: true,
          street: true,
          city: true,
          state: true,
          zip_code: true,
        },
        services: {
          id: true,
          ticket: {
            status: true,
          },
          category: true,
          title: true,
          description: true,
          work_photos: true,
        },
      },
    });

    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }
}
