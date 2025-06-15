import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/modules/users/entities/roles.enum';

const jwtService = new JwtService();

export const ExtractPayload = (token: string) => {
  const bearerToken = token?.split(' ')[1];
  let payload: { id: string; email: string; role: Role };
  try {
    const secret = process.env.JWT_SECRET;
    payload = jwtService.verify(bearerToken, { secret });
  } catch {
    throw new UnauthorizedException('Token inválido o no proporcionado');
  }
  return payload;
};
