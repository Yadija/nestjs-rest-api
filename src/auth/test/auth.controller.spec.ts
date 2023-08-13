import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyUserCredential: jest
              .fn()
              .mockImplementation(() => Promise.resolve('johndoe')),
            getTokens: jest.fn().mockImplementation(() =>
              Promise.resolve({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should be able to login', async () => {
      service.updateRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const result = await controller.login({
        username: 'johndoe',
        password: 'secret',
      });

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');

      expect(result.data).toBeDefined();
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.accessToken).toBe('access_token');
      expect(result.data.refreshToken).toBeDefined();
      expect(result.data.refreshToken).toBe('refresh_token');
    });
  });

  describe('logout', () => {
    it('should be able to logout', async () => {
      service.deleteToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const result = await controller.logout('johndoe');

      expect(result).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.status).toBe('success');
      expect(result.message).toBeDefined();
    });
  });
});
