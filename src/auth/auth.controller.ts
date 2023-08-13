import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() auth: AuthDto) {
    const username = await this.authService.verifyUserCredential(auth);
    const { accessToken, refreshToken } = await this.authService.getTokens(
      username,
    );
    await this.authService.updateRefreshToken(username, refreshToken);

    return {
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
