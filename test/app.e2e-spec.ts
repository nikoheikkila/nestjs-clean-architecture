import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ChatPayload, ChatService, Timer } from '../src/interfaces';
import { OpenAIChatService } from '../src/chat.service';
import { TimerService } from "../src/timer.service";

class FakeChatService implements ChatService {
  async generateAnswer(prompt: string): Promise<string> {
    return `Response: ${prompt}`;
  }
}

class FakeTimerService implements Timer {
  start() {}
  stop() {
    return 1000;
  }
}

describe('ChatController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OpenAIChatService)
      .useClass(FakeChatService)
      .overrideProvider(TimerService)
      .useClass(FakeTimerService)
      .compile();

    app = moduleFixture.createNestApplication();
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

    it('throws error for empty prompt', async () => {
      const { status, body: error } = await authorizedPost({
        prompt: '',
        temperature: 1.0,
      });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Prompt cannot be empty');
    });

    it('throws error for invalid temperature', async () => {
      const { status, body: error } = await authorizedPost({
        prompt: 'Hello',
        temperature: -1.0,
      });

      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Temperature must be greater than 0.0');
    });

    it('throws error for missing API key', async () => {
      const { status, body: error } = await unauthorizedPost({
        prompt: 'Hello',
        temperature: 1.0,
      });

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.message).toBe('Missing OpenAI API key in header');
    });
  });
});
