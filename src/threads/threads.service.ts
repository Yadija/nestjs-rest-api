import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThreadsService {
  constructor(private readonly prisma: PrismaService) {}

  async addthread(content: string, owner: string) {
    return this.prisma.thread.create({
      data: {
        content,
        owner,
      },
      select: {
        id: true,
      },
    });
  }
}
