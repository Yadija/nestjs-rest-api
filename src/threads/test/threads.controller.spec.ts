import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from '../threads.controller';
import { ThreadsService } from '../threads.service';

describe('ThreadsController', () => {
  let controller: ThreadsController;
  let service: ThreadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        {
          provide: ThreadsService,
          useValue: {
            addthread: jest
              .fn()
              .mockImplementation(() => Promise.resolve({ id: 'thread-1' })),
            getAllThreads: jest.fn().mockImplementation(() =>
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
            getThreadById: jest.fn().mockImplementation(() =>
              Promise.resolve({
                id: 'thread-1',
                content: 'New Thread',
                owner: 'johndoe',
                createdAt: '1970-01-01 00:00:00.000',
                updatedAt: '1970-01-01 00:00:00.000',
              }),
            ),
            editThreadById: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            deleteThreadById: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            checkThreadIsExist: jest.fn().mockImplementation(() =>
              Promise.resolve({
                owner: 'johndoe',
              }),
            ),
            verifyThreadOwner: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    controller = module.get<ThreadsController>(ThreadsController);
    service = module.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createThread', () => {
    it('should be able to create new thread', async () => {
      const result = await controller.createThread('johndoe', {
        content: 'New Thread',
      });

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');

      expect(result.data).toBeDefined();
      expect(result.data.threadId).toBeDefined();
      expect(result.data.threadId).toBe('thread-1');
    });
  });

  describe('getThreads', () => {
    it('should be able to get all threads', async () => {
      const result = await controller.getThreads();

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');

      expect(result.data).toBeDefined();
      expect(result.data.threads).toBeDefined();
      expect(result.data.threads).toHaveLength(2);

      for (let i = 0; i < result.data.threads.length; i++) {
        expect(result.data.threads[i].id).toBeDefined();
        expect(result.data.threads[i].content).toBeDefined();
        expect(result.data.threads[i].owner).toBeDefined();
      }
    });
  });

  describe('getThreadById', () => {
    it('should be able to get thread by id', async () => {
      const result = await controller.getThreadById('thread-1');

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');

      expect(result.data).toBeDefined();
      expect(result.data.thread).toBeDefined();

      expect(result.data.thread.id).toBeDefined();
      expect(result.data.thread.content).toBeDefined();
      expect(result.data.thread.owner).toBeDefined();
      expect(result.data.thread.createdAt).toBeDefined();
      expect(result.data.thread.updatedAt).toBeDefined();
    });
  });

  describe('updateThread', () => {
    it('should be able to update thread', async () => {
      const result = await controller.updateThread(
        'johndoe',
        { content: 'Update Thread' },
        'thread-1',
      );

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.message).toBeDefined();
    });
  });

  describe('deleteThread', () => {
    it('should be able to delete thread', async () => {
      const result = await controller.deleteThread('johndoe', 'thread-1');

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.message).toBeDefined();
    });
  });
});
