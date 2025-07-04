import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../users/DTOs/user.dto';
import * as bcrypt from 'bcrypt';
import { CredentialsDto, UpdateImageDto } from './DTOs/credentials.dto';
import { Address } from '../users/entities/address.entity';
import { Role } from '../users/entities/roles.enum';
import { EmailService } from '../email/email.service';
import { Payload } from './types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async addUser({ confirmPassword, ...user }: UserDto) {
    const confirmUser = await this.UserRepository.findOneBy({
      email: user.email,
    });
    if (confirmUser) throw new BadRequestException('El usuario ya existe');
    if (user.password !== confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    const hashedPassword: string = await bcrypt.hash(user.password, 10);

    const { street, city, state, zip_code, house_number, ...userCreate } = user;

    const savedUser = await this.UserRepository.save({
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
      user_id: savedUser,
    });

    const userDB = await this.UserRepository.findOne({
      where: { id: savedUser.id },
      relations: { address_id: true },
    });

    if (!userDB) {
      throw new BadRequestException(
        'Error al recuperar el usuario recién creado',
      );
    }

    await this.emailService.registerEmail(userDB.email, userDB.name, userDB.id);

    return userDB;
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

    const payload: Payload = {
      id: confirmUser.id,
      email: confirmUser.email,
      role: confirmUser.role,
      name: confirmUser.name,
      premium: confirmUser.premium,
    };

    const token = this.jwtService.sign(payload);
    return { token };
  }

  async googleSignIn(credentials: Omit<UpdateImageDto, 'password'>) {
    const { email, name, image } = credentials;
    const confirmUser = await this.UserRepository.findOneBy({ email });

    if (!confirmUser) {
      const newUser = await this.UserRepository.save({
        name,
        email,
        password: 'Google@Auth', // solo como dummy
        role: Role.user,
        user_pic: image,
        created_at: new Date(),
      });

      const address = await this.AddressRepository.save({
        user_id: newUser,
      });

      newUser.address_id = address;
      await this.UserRepository.save(newUser);

      const payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      };

      const token = this.jwtService.sign(payload);

      await this.emailService.registerEmail(
        newUser.email,
        newUser.name,
        newUser.id,
      );

      return { token };
    }

    // Usuario ya existe, generar token igual
    const payload = {
      id: confirmUser.id,
      email: confirmUser.email,
      role: confirmUser.role,
      name: confirmUser.name,
    };

    const token = this.jwtService.sign(payload);
    return { token };
  }
}
