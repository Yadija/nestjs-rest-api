import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('newUser', () => {
    it('should be able to insert new user', async () => {
      prisma.user.create = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ username: 'johndoe', fullname: 'John Doe' }),
        );

      expect(
        await service.newUser({
          username: 'john',
          password: 'secret',
          fullname: 'John Doe',
        }),
      ).toStrictEqual({ username: 'johndoe', fullname: 'John Doe' });
    });
  });

  describe('verifyNewUsername', () => {
    it('should to throw bad request exception', async () => {
      prisma.user.count = jest
        .fn()
        .mockImplementation(() => Promise.resolve(1));

      expect(() => service.verifyNewUsername('john')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
