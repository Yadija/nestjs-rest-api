import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser, GetCurrentUsername } from '../common/decorators';

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

  @UseGuards(AuthGuard('jwt-refresh'))
  @Put()
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUsername() username: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    await this.authService.verifyUserAndToken(username, refreshToken);
    const tokens = await this.authService.getTokens(username);
    await this.authService.updateRefreshToken(username, tokens.refreshToken);

    return {
      status: 'success',
      data: tokens,
    };
  }
}
