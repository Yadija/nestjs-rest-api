import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async newUser(user: UserDto) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.prisma.user.create({
      data: user,
      select: {
        username: true,
        fullname: true,
      },
    });
  }

  async verifyNewUsername(username: string) {
    const count = await this.prisma.user.count({
      where: {
        username,
      },
    });

    if (count > 0) {
      throw new BadRequestException('username already exists');
    }
  }
}
