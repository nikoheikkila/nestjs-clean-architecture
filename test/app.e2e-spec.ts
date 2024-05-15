import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ChatController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/v1/chat', () => {
    it('responds with Hello', () => {
      return request(app.getHttpServer())
        .get('/api/v1/chat')
        .expect(200)
        .expect('Hello World!');
    });
  });
});
