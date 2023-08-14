import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from '../threads.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ThreadsService', () => {
  let service: ThreadsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: PrismaService,
          useValue: {
            thread: {
              create: jest
                .fn()
                .mockImplementation(() => Promise.resolve({ id: 'thread-1' })),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addthread', () => {
    it('should be able to add thread', async () => {
      expect(await service.addthread('New Thread', 'johndoe')).toStrictEqual({
        id: 'thread-1',
      });
    });
  });
});
