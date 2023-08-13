import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUserCredential(auth: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: auth.username,
      },
      select: {
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('username or password incorrect');
    }

    const { username, password: hashedPassword } = user;

    const match = await bcrypt.compare(auth.password, hashedPassword);

    if (!match) {
      throw new UnauthorizedException('username or password incorrect');
    }

    return username;
  }

  async getTokens(username: string) {
    const jwtPayload = {
      sub: username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(username: string, token: string) {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        token,
      },
    });
  }

  async deleteToken(username: string) {
    await this.prisma.user.update({
      where: {
        username,
      },
      data: {
        token: null,
      },
    });
  }
}
