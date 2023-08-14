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
});
