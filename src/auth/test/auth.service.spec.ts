import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockImplementation(() =>
                Promise.resolve({
                  username: 'johndoe',
                  password: 'secret',
                }),
              ),
            },
          },
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyUserCredential', () => {
    it('should be able to cannot verify user if username not register', async () => {
      prisma.user.findUnique = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));

      expect(async () => {
        await service.verifyUserCredential({
          username: 'johndoe',
          password: 'secret',
        });
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should be able to cannot verify user if password wrong', async () => {
      // mocking bcrypt
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      expect(async () => {
        await service.verifyUserCredential({
          username: 'johndoe',
          password: 'wrong_password',
        });
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should be able to verify user', async () => {
      // mocking bcrypt
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      expect(
        await service.verifyUserCredential({
          username: 'johndoe',
          password: 'secret',
        }),
      ).toBe('johndoe');
    });
  });

  describe('getTokens', () => {
    it('should be able to return access token and refresh token', async () => {
      const getTokens = await service.getTokens('johndoe');

      expect(getTokens).toBeDefined();
      expect(getTokens.accessToken).toBeDefined();
      expect(getTokens.refreshToken).toBeDefined();
    });
  });

  describe('updateRefreshToken', () => {
    it('should be able to update refresh token', async () => {
      prisma.user.update = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      expect(
        await service.updateRefreshToken('johndoe', 'refreshtoken'),
      ).toBeUndefined();
    });
  });

  describe('deleteToken', () => {
    it('should be able to delete refresh token', async () => {
      prisma.user.update = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      expect(await service.deleteToken('johndoe')).toBeUndefined();
    });
  });

  describe('verifyUserAndToken', () => {
    it('should throw forbidden error if user token null', async () => {
      prisma.user.findUnique = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ token: null }));

      expect(async () => {
        await service.verifyUserAndToken('johndoe', 'refresh_token');
      }).rejects.toThrow(ForbiddenException);
    });

    it('should throw forbidden error if token invalid', async () => {
      prisma.user.findUnique = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ token: 'refresh_token' }));

      expect(async () => {
        await service.verifyUserAndToken('johndoe', 'wrong_refresh_token');
      }).rejects.toThrow(ForbiddenException);
    });
  });
});
