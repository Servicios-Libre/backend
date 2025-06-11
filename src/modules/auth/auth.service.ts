import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isAdmin, ...newUser } = await this.UserRepository.save({
      ...user,
      password: hashedPassword,
    });
    return newUser;
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
      isAdmin: confirmUser.isAdmin,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
