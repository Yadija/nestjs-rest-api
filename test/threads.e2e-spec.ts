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

  describe('GET: /threads', () => {
    it('it should can find all threads', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const response = await request(app.getHttpServer()).post('/auth').send({
        username: 'johndoe',
        password: 'secret',
      });

      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/threads')
          .auth(response.body.data.accessToken, {
            type: 'bearer',
          })
          .send({
            content: `New Thread ${i + 1}`,
          });
      }

      const { status, body } = await request(app.getHttpServer()).get(
        '/threads',
      );

      expect(status).toBe(200);
      expect(body.status).toBe('success');
      expect(body.data.threads.length).toBe(5);
    });
  });

  describe('GET: /threads/:threadId', () => {
    it('it should can find thread by id', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const response = await request(app.getHttpServer()).post('/auth').send({
        username: 'johndoe',
        password: 'secret',
      });

      const responseThread = await request(app.getHttpServer())
        .post('/threads')
        .auth(response.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      const { status, body } = await request(app.getHttpServer()).get(
        `/threads/${responseThread.body.data.threadId}`,
      );

      expect(status).toBe(200);
      expect(body.status).toBe('success');
      expect(body.data.thread.id).toBeDefined();

      expect(body.data.thread.content).toBeDefined();
      expect(body.data.thread.content).toBe('New Thread');

      expect(body.data.thread.owner).toBeDefined();
      expect(body.data.thread.owner).toBe('johndoe');

      expect(body.data.thread.createdAt).toBeDefined();
      expect(body.data.thread.updatedAt).toBeDefined();
    });

    it('it should cannot find thread if id thread is incorrect', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/threads/123-456',
      );

      expect(status).toBe(404);
      expect(body.message).toBeDefined();
    });
  });

  describe('PUT: /threads/:threadId', () => {
    it('it should can update thread', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const responseAuth = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'secret',
        });

      const responseThread = await request(app.getHttpServer())
        .post('/threads')
        .auth(responseAuth.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      const { status, body } = await request(app.getHttpServer())
        .put(`/threads/${responseThread.body.data.threadId}`)
        .auth(responseAuth.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'Updated Thread',
        });

      expect(status).toBe(200);
      expect(body.status).toBe('success');
      expect(body.message).toBeDefined();
    });

    it('it should cannot update thread if user unauthenticated', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const responseAuth = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'secret',
        });

      const responseThread = await request(app.getHttpServer())
        .post('/threads')
        .auth(responseAuth.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      const { status, body } = await request(app.getHttpServer())
        .put(`/threads/${responseThread.body.data.threadId}`)
        .send({
          content: 'Updated Thread',
        });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Unauthorized');
    });

    it('it should cannot update thread if user not authorized', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      await request(app.getHttpServer()).post('/users').send({
        username: 'janedoe',
        password: 'secret',
        fullname: 'Jane Doe',
      });
      const responseAuthJohn = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'secret',
        });
      const responseAuthJane = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'janedoe',
          password: 'secret',
        });

      const responseThread = await request(app.getHttpServer())
        .post('/threads')
        .auth(responseAuthJohn.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      const { status, body } = await request(app.getHttpServer())
        .put(`/threads/${responseThread.body.data.threadId}`)
        .auth(responseAuthJane.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'Updated Thread',
        });

      expect(status).toBe(403);
      expect(body.message).toBeDefined();
    });

    it('it should cannot update thread if thread id is incorrect', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      const responseAuth = await request(app.getHttpServer())
        .post('/auth')
        .send({
          username: 'johndoe',
          password: 'secret',
        });

      await request(app.getHttpServer())
        .post('/threads')
        .auth(responseAuth.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      const { status, body } = await request(app.getHttpServer())
        .put('/threads/123-456')
        .auth(responseAuth.body.data.accessToken, {
          type: 'bearer',
        })
        .send({
          content: 'New Thread',
        });

      expect(status).toBe(404);
      expect(body.message).toBeDefined();
    });
  });
});
