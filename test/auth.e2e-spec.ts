import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST: /auth', () => {
    it('it should can login', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });

      const { status, body } = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'secret',
        });

      expect(status).toBe(200);
      expect(body.status).toBe('success');
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });

    it('it should cannot login if username is incorrect', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const { status, body } = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'wrong_username',
          password: 'secret',
        });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.error).toBe('Unauthorized');
    });

    it('it should cannot login if password is incorrect', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const { status, body } = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'wrong_password',
        });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.error).toBe('Unauthorized');
    });
  });
});
