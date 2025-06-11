import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/DTOs/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  SignUp(@Body() user: UserDto) {
    return this.authService.addUser(user);
  }

  @Post('signin')
  SignIn(@Body() credentials) {
    return this.authService.signin(credentials);
  }
}
