import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async editThreadById(id: string, content: string) {
    await this.prisma.thread.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  }

  async deleteThreadById(id: string) {
    await this.prisma.thread.delete({
      where: {
        id,
      },
    });
  }

  async checkThreadIsExist(id: string) {
    const thread = await this.prisma.thread.findFirst({
      where: {
        id,
      },
      select: {
        owner: true,
      },
    });

    if (!thread) {
      throw new NotFoundException('cannot find thread');
    }

    return thread;
  }

  async verifyThreadOwner(owner: string, username: string) {
    if (owner !== username) {
      throw new ForbiddenException(
        'you are not entitled to access this resource',
      );
    }
  }
}
