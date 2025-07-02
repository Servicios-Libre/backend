import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { ILike, Repository } from 'typeorm';
import { ExtractPayload } from 'src/helpers/extractPayload.token';
import { Address } from './entities/address.entity';
import { Role } from './entities/roles.enum';
import { Service } from '../workerServices/entities/service.entity';
import { Social } from './entities/social.entity';
import { SocialDto } from './DTOs/social.dto';
import * as data from './data/data.json';
import { State } from './entities/state.entity';
import { City } from './entities/cities.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    //redes sociales
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    //seeder de states y ciudades
    @InjectRepository(State) private stateRepository: Repository<State>,
    @InjectRepository(City) private cityRepository: Repository<City>,
  ) {}

  async getAllUsers(page = 1, limit = 10, role?: Role, search?: string) {
    const where: any[] = [];
    if (search && search.trim() !== '') {
      where.push(
        { name: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      );
    }

    if (role) {
      if (where.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
        where.forEach((cond, i) => (where[i] = { ...cond, role }));
      } else {
        where.push({ role });
      }
    }

    const [users, total] = await this.UserRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
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
      relations: { address_id: true, tickets: true, social: true },
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
    if (body.description)
      await this.UserRepository.update(
        { id: userID },
        { description: body.description },
      );
    if (body.name)
      await this.UserRepository.update({ id: userID }, { name: body.name });

    const addressActualization = {};
    for (const key in body) {
      if (body[key]) {
        if (key !== 'phone' && key !== 'description' && key !== 'name')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          addressActualization[key] = body[key];
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
        social: true,
        services: {
          work_photos: true,
          category: true,
          ticket: true,
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
        description: true,
        availability: true,
        address_id: {
          id: true,
          street: true,
          city: true,
          state: true,
          zip_code: true,
          house_number: true,
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

  async workerToUser(id: string) {
    const user = await this.UserRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'user')
      throw new BadRequestException('User is already a user');
    await this.UserRepository.update(
      { id },
      { role: 'user', availability: false },
    );

    const services = await this.serviceRepository.find({
      where: { worker: { id } },
    });
    if (services && services.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      services.map(async (service) => {
        await this.serviceRepository.delete({ id: service.id });
      });
    }
    return { message: 'Worker updated to user' };
  }

  async createSocial(token: string, socialLinks: SocialDto) {
    const { id } = ExtractPayload(token);

    if (Object.keys(socialLinks).length === 0)
      throw new BadRequestException('Social links are required');
    const user = await this.UserRepository.findOne({
      where: { id },
      relations: ['social'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.social) {
      throw new BadRequestException('User already has social links');
    }

    await this.socialRepository.save({
      user: user,
      facebook: socialLinks.facebook,
      instagram: socialLinks.instagram,
      linkedin: socialLinks.linkedin,
      x: socialLinks.x,
    });

    return { message: 'Social links created' };
  }

  async updateSocial(token: string, socialLinks: SocialDto) {
    const { id } = ExtractPayload(token);
    if (Object.keys(socialLinks).length === 0)
      throw new BadRequestException('Social links are required');

    const social = await this.socialRepository.findOne({
      where: { user: { id } },
    });

    if (!social)
      throw new BadRequestException('User does not have social links');

    for (const prop in socialLinks) {
      if (socialLinks[prop] === undefined) socialLinks[prop] = null;
    }

    await this.socialRepository.update(social.id, socialLinks);
    return { message: 'Social links updated' };
  }

  async seederStatesCities() {
    for (const state of data) {
      await this.stateRepository.save({ state: state.state });
      for (const city of state.cities) {
        const stateDB = await this.stateRepository.findOne({
          where: { state: state.state },
        });
        if (!stateDB) throw new Error('State not found');
        await this.cityRepository.save({
          name: city,
          state: stateDB,
        });
      }
    }
  }

  async getStates() {
    const states = await this.stateRepository.find({
      relations: ['cities'],
      select: {
        state: true,
        cities: {
          name: true,
        },
      },
    });

    return states;
  }

  async getPremiumUsers(): Promise<
    {
      id: string;
      nombre: string;
      profesion: string;
      ubicacion: string;
      imagen: string;
      descripcion: string;
    }[]
  > {
    const users = await this.UserRepository.find({
      where: { premium: true },
      relations: ['address_id'],
      select: {
        id: true,
        name: true,
        user_pic: true,
        description: true,
        address_id: {
          city: true,
          state: true,
        },
        role: true,
      },
    });

    return users.map((u) => ({
      id: u.id,
      nombre: u.name,
      profesion: u.role === 'worker' ? 'Especialista' : 'Usuario premium',
      ubicacion: `${u.address_id?.city || ''}, ${u.address_id?.state || ''}`,
      imagen: u.user_pic ?? 'https://example.com/default-avatar.png',
      descripcion: u.description ?? 'Miembro premium de la comunidad',
    }));
  }

  async anyUserToAdmin(id: string) {
    const user = await this.UserRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === 'admin')
      throw new BadRequestException('User is already an admin');

    user.role = Role.admin;

    await this.UserRepository.save(user);

    return { message: 'User has been promoted to admin' };
  }

  async downgradeAdmin(id: string) {
    const user = await this.UserRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== 'admin')
      throw new BadRequestException('User is not an admin');

    user.role = Role.user;

    await this.UserRepository.save(user);

    return { message: 'User has been downgraded to user' };
  }
}
