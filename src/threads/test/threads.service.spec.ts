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
              findMany: jest.fn().mockImplementation(() =>
                Promise.resolve([
                  {
                    id: 'thread-1',
                    content: 'Thread 1',
                    owner: 'johndoe',
                  },
                  {
                    id: 'thread-2',
                    content: 'Thread 2',
                    owner: 'janedoe',
                  },
                ]),
              ),
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

  describe('getAllThreads', () => {
    it('should be able to return all threads', async () => {
      expect(await service.getAllThreads()).toStrictEqual([
        {
          id: 'thread-1',
          content: 'Thread 1',
          owner: 'johndoe',
        },
        {
          id: 'thread-2',
          content: 'Thread 2',
          owner: 'janedoe',
        },
      ]);
    });
  });
});
