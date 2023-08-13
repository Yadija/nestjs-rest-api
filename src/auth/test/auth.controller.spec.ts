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

      const login = await controller.login({
        username: 'johndoe',
        password: 'secret',
      });

      expect(login).toBeDefined();
      expect(login.status).toBeDefined();
      expect(login.status).toBe('success');

      expect(login.data).toBeDefined();
      expect(login.data.accessToken).toBeDefined();
      expect(login.data.accessToken).toBe('access_token');
      expect(login.data.refreshToken).toBeDefined();
      expect(login.data.refreshToken).toBe('refresh_token');
    });
  });
});
