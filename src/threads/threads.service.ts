import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllThreads() {
    return this.prisma.thread.findMany({
      select: {
        id: true,
        content: true,
        owner: true,
      },
    });
  }

  async getThreadById(id: string) {
    const result = await this.prisma.thread.findFirst({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('cannot find thread');
    }

    return {
      id: result.id,
      content: result.content,
      owner: result.owner,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }
}
