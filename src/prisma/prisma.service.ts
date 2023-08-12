/* istanbul ignore file */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('error' as never, async (error: any) => {
      this.logger.error(`(${error.duration}ms) ${error.query}`);
    });

    this.$on('warn' as never, async (error: any) => {
      this.logger.warn(`(${error.duration}ms) ${error.query}`);
    });

    this.$on('info' as never, async (error: any) => {
      this.logger.log(`(${error.duration}ms) ${error.query}`);
    });

    this.$on('query' as never, async (error: any) => {
      this.logger.debug(`(${error.duration}ms) ${error.query}`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
