import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async GetUserById(token: string) {
    const bearerToken = token?.split(' ')[1];
    let payload;
    try {
      const secret = process.env.JWT_SECRET;
      payload = this.jwtService.verify(bearerToken, { secret });
    } catch {
      throw new UnauthorizedException('Token inválido o no proporcionado');
    }
    return await this.UserRepository.findOne({
      where: { id: payload.id },
      relations: { address_id: true },
    });
  }
}
