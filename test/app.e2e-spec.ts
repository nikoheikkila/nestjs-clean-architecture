import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
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

    it('responds to a valid prompt with generated answer and duration', async () => {
      const expectedResponse = 'Hello, I am ChatGPT';
      const expectedDuration = 500;

      const { body, status } = await request(app.getHttpServer())
        .post('/api/v1/chat')
        .set('X-OpenAI-API-Key', 'ad7f9f0d-77ea-48f1-a8d8-c9d91727da47')
        .send({ prompt: 'Hello, who are you?' });

      expect(status).toBe(HttpStatus.OK);
      expect(body.answer).toBe(expectedResponse);
      expect(body.duration).toBe(expectedDuration);
    });
  });
});
