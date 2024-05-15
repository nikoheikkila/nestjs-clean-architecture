import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ChatPayload } from '../src/interfaces';

describe('ChatController', () => {
  let app: INestApplication;

  async function authorizedPost(payload: ChatPayload) {
    return request(app.getHttpServer())
      .post('/api/v1/chat')
      .set('X-OpenAI-API-Key', 'ad7f9f0d-77ea-48f1-a8d8-c9d91727da47')
      .send(payload);
  }

  async function unauthorizedPost(payload: ChatPayload) {
    return request(app.getHttpServer())
      .post('/api/v1/chat')
      .send(payload);
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/v1/chat', () => {
    it('responds to a valid prompt and temperature with generated answer and duration', async () => {
      const expectedResponse = 'Hello, I am ChatGPT';
      const expectedDuration = 500;
      const temperature = 1.0;

      const { body, status } = await authorizedPost({
        prompt: 'Hello',
        temperature,
      });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toMatchObject({
        answer: expectedResponse,
        duration: expectedDuration,
        temperature,
      });
    });

    it('throws error for empty prompt', async () => {
      const { status, body: error } = await authorizedPost({ prompt: '', temperature: 1.0 });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Prompt cannot be empty');
    });

    it('throws error for invalid temperature', async () => {
      const { status, body: error } = await authorizedPost({ prompt: 'Hello', temperature: -1.0 });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Temperature must be greater than 0.0');
    });

    it('throws error for missing API key', async () => {
      const { status, body: error } = await unauthorizedPost({ prompt: 'Hello', temperature: 1.0 });

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Missing OpenAI API key in header');
    });
  });
});
