import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService();

export const ExtractPayload = (token: string) => {
  const bearerToken = token?.split(' ')[1];
  let payload;
  try {
    const secret = process.env.JWT_SECRET;
    payload = jwtService.verify(bearerToken, { secret });
  } catch {
    throw new UnauthorizedException('Token inválido o no proporcionado');
  }
  return payload;
};
