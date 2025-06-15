import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../users/DTOs/user.dto';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './DTOs/credentials.dto';
import { Address } from '../users/entities/address.entity';
import { Role } from '../users/entities/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
    private readonly jwtService: JwtService,
  ) {}

  async addUser({ confirmPassword, ...user }: UserDto) {
    const confirmUser = await this.UserRepository.findOneBy({
      email: user.email,
    });
    if (confirmUser) throw new BadRequestException('El usuario ya existe');
    if (user.password !== confirmPassword)
      throw new BadRequestException('las contraseñas no coinciden');
    const hashedPassword: string = await bcrypt.hash(user.password, 10);

    const { street, city, state, zip_code, house_number, ...userCreate } = user;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.UserRepository.save({
      ...userCreate,
      password: hashedPassword,
      created_at: new Date(),
      experience: 0,
      rate: 0,
      role: Role.user,
    });

    await this.AddressRepository.save({
      street,
      city,
      state,
      zip_code,
      house_number,
      user_id: newUser,
    });

    // await this.UserRepository.update(newUser.id, { address_id: [newAddress] });

    return this.UserRepository.findOne({
      where: { id: newUser.id },
      relations: { address_id: true },
    });
  }

  async signin(credentials: CredentialsDto) {
    const confirmUser = await this.UserRepository.findOneBy({
      email: credentials.email,
    });
    if (!confirmUser) throw new BadRequestException('Credenciales incorrectas');
    const confirmation = await bcrypt.compare(
      credentials.password,
      confirmUser.password,
    );
    if (!confirmation)
      throw new BadRequestException('Credenciales incorrectas');
    const payload = {
      id: confirmUser.id,
      email: confirmUser.email,
      role: confirmUser.role,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
