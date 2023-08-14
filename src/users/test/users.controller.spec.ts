import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            verifyNewUsername: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            newUser: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ username: 'johndoe', fullname: 'John Doe' }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should be able to create new user', async () => {
      const result = await controller.createUser({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');

      expect(result.data).toBeDefined();
      expect(result.data.username).toBeDefined();
      expect(result.data.fullname).toBeDefined();
    });
  });
});
