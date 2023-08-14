import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUsername } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
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

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUsername() username: string) {
    await this.authService.deleteToken(username);

    return {
      status: 'success',
      message: 'refresh token deleted successfully',
    };
  }
}
