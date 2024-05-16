import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { OpenAIChatService } from '../src/chat';
import { TimerService } from '../src/timer';
import { StructuredLogger } from '../src/logger';
import { ChatPayload } from '../src/contracts/chat.contract';
import { FakeChatService, FakeTimerService, NullLogger } from './fakes';

describe('ChatController', () => {
  let app: INestApplication;
  let logger: NullLogger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OpenAIChatService)
      .useClass(FakeChatService)
      .overrideProvider(TimerService)
      .useClass(FakeTimerService)
      .overrideProvider(StructuredLogger)
      .useClass(NullLogger)
      .compile();

    app = moduleFixture.createNestApplication();
    logger = moduleFixture.get<NullLogger>(StructuredLogger);

    await app.init();
  });

  async function authorizedPost(payload: ChatPayload) {
    return request(app.getHttpServer())
      .post('/api/v1/chat')
      .set('X-OpenAI-API-Key', 'ad7f9f0d-77ea-48f1-a8d8-c9d91727da47')
      .send(payload);
  }

  async function unauthorizedPost(payload: ChatPayload) {
    return request(app.getHttpServer()).post('/api/v1/chat').send(payload);
  }

  describe('POST /api/v1/chat', () => {
    it('responds to a valid prompt and temperature with generated answer and duration', async () => {
      const prompt = 'Hello';
      const expectedResponse = 'Response: Hello';
      const expectedDuration = 1000;
      const temperature = 1.0;

      const { body, status } = await authorizedPost({
        prompt,
        temperature,
      });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toMatchObject({
        answer: expectedResponse,
        duration: expectedDuration,
        temperature,
      });
    });

    it('throw error for missing prompt', async () => {
      const errorMessage = /Prompt cannot be empty/;

      const { status, body: error } = await authorizedPost({
        prompt: undefined,
        temperature: 1.0,
      });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toMatch(errorMessage);
      expect(logger.messages()).toMatch(errorMessage);
    });

    it('throws error for empty prompt', async () => {
      const errorMessage = 'Prompt cannot be empty';

      const { status, body: error } = await authorizedPost({
        prompt: '',
        temperature: 1.0,
      });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe(errorMessage);
      expect(logger.messages()).toContain(errorMessage);
    });

    it('throws error for invalid temperature', async () => {
      const errorMessage = 'Temperature must be greater than 0.0';

      const { status, body: error } = await authorizedPost({
        prompt: 'Hello',
        temperature: -1.0,
      });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe(errorMessage);
      expect(logger.messages()).toContain(errorMessage);
    });

    it('throws error for missing API key', async () => {
      const errorMessage = 'Missing OpenAI API key in header';

      const { status, body: error } = await unauthorizedPost({
        prompt: 'Hello',
        temperature: 1.0,
      });

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.message).toBe(errorMessage);
      expect(logger.messages()).toContain(errorMessage);
    });
  });
});
