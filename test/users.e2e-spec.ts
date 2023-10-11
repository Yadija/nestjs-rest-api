import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { afterEach } from 'node:test';

describe('Users (e2e)', () => {
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

  describe('POST: /users', () => {
    it('it should create a new user', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        })
        .expect(201)
        .expect({
          status: 'success',
          data: {
            username: 'johndoe',
            fullname: 'John Doe',
          },
        });
    });

    it('it should cannot create a new user if username already exists', async () => {
      await request(app.getHttpServer()).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });
      return request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'johndoe',
          password: 'secret',
          fullname: 'John Doe',
        })
        .expect(400)
        .expect({
          message: 'username already exists',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });
});
