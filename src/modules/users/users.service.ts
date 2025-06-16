import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { ExtractPayload } from 'src/helpers/extractPayload.token';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
  ) {}
  async GetUserById(token: string) {
    const payload = ExtractPayload(token);
    const user = await this.UserRepository.findOne({
      where: { id: payload.id },
      relations: { address_id: true },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userClean } = user;
      return userClean;
    }
    return 'Id inexistente';
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
}
