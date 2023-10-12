import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Threads (e2e)', () => {
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
    await prisma.thread.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST: /threads', () => {
    it('it should can create a new thread', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const response = await request(app.getHttpServer()).post('/auth').send({
        username: 'johndoe',
        password: 'secret',
      });

      const { status, body } = await request(app.getHttpServer())
        .post('/threads')
        .auth(response.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      expect(status).toBe(201);
      expect(body.status).toBe('success');
      expect(body.data.threadId).toBeDefined();
    });

    it('it should cannot create a new thread if user unauthenticated', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/threads')
        .send({
          content: 'New Thread',
        });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Unauthorized');
    });
  });
});
