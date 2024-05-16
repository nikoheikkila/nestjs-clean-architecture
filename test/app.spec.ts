import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('Application', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('GET /', () => {
    it('returns HTTP 200 OK', () => {
      return request(app.getHttpServer()).get('/health').expect(HttpStatus.OK);
    });
  });
});
