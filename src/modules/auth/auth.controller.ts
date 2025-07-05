import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/DTOs/user.dto';
import { CredentialsDto, UpdateImageDto } from './DTOs/credentials.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('🔒 Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  SignUp(@Body() user: UserDto) {
    return this.authService.addUser(user);
  }

  @Post('signin')
  SignIn(@Body() credentials: CredentialsDto) {
    return this.authService.signin(credentials);
  }

  @Post('google')
  GoogleSignIn(@Body() credentials: UpdateImageDto) {
    return this.authService.googleSignIn(credentials);
  }
}
