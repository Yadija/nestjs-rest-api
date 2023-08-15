import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from '../threads.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
              findFirst: jest.fn().mockImplementation(() =>
                Promise.resolve({
                  id: 'thread-1',
                  content: 'New Thread',
                  owner: 'johndoe',
                  created_at: '1970-01-01 00:00:00.000',
                  updated_at: '1970-01-01 00:00:00.000',
                }),
              ),
              update: jest.fn().mockImplementation(() => Promise.resolve()),
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

  describe('getThreadById', () => {
    it('should throw not found error if id wrong', async () => {
      prisma.thread.findFirst = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));

      expect(() => service.getThreadById('thread-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should be able to return thread by id', async () => {
      expect(await service.getThreadById('thread-1')).toStrictEqual({
        id: 'thread-1',
        content: 'New Thread',
        owner: 'johndoe',
        createdAt: '1970-01-01 00:00:00.000',
        updatedAt: '1970-01-01 00:00:00.000',
      });
    });
  });

  describe('editThreadById', () => {
    it('should be able to update thread', async () => {
      expect(
        await service.editThreadById('thread-1', 'Update Thread'),
      ).toBeUndefined();
    });
  });

  describe('checkThreadIsExist', () => {
    it('should throw not found error if id wrong', async () => {
      prisma.thread.findFirst = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));

      expect(() => service.checkThreadIsExist('thread-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should be able to return thread by id', async () => {
      prisma.thread.findFirst = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ content: 'New Thread' }));

      expect(await service.checkThreadIsExist('thread-1')).toStrictEqual({
        content: 'New Thread',
      });
    });
  });

  describe('verifyThreadOwner', () => {
    it('should throw forbidden error if not actually owner', async () => {
      expect(() =>
        service.verifyThreadOwner('owner-1', 'owner-2'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
