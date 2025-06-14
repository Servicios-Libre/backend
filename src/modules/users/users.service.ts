import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { ExtractPayload } from 'src/helpers/extractPayload.token';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}
  async GetUserById(token: string) {
    const payload = ExtractPayload(token);
    const user = await this.UserRepository.findOne({
      where: { id: payload.id },
      relations: { address_id: true },
    });
    if (user) {
      const { password, ...userClean } = user;
      return userClean;
    }
    return 'Id inexistente';
  }

  async UpdateUser(token: string, body: Partial<User>) {
    const payload = ExtractPayload(token);
    await this.UserRepository.update(payload.id, {});
  }
}
