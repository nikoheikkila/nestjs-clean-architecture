import {
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ChatPayload } from './interfaces';
import { OpenAIChatService } from './chat.service';
import { TimerService } from './timer.service';
import { StructuredLogger } from './logger.service';
import * as process from 'node:process';
import { Errors } from "./errors";

@Controller('api/v1/chat')
export class ChatController {
  constructor(
    private readonly chatService: OpenAIChatService,
    private readonly timerService: TimerService,
    private readonly logger: StructuredLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  public async chat(
    @Req() request: Request,
    @Body() chatPayload: ChatPayload,
    @Headers() headers: Record<string, unknown>,
  ) {
    const payload = {
      method: request.method,
      endpoint: request.url,
      process: process.pid,
    };

    this.logger.debug('Received a new request', payload);

    const token = headers['x-openai-api-key'] as string;

    if (!token) {
      this.logger.error(Errors.MISSING_OPENAI_API_KEY, payload);
      throw new HttpException(
        Errors.MISSING_OPENAI_API_KEY,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { prompt, temperature } = chatPayload;

    if (prompt.length === 0) {
      this.logger.error(Errors.EMPTY_PROMPT, payload);
      throw new HttpException(Errors.EMPTY_PROMPT, HttpStatus.BAD_REQUEST);
    }

    if (temperature <= 0.0) {
      this.logger.error(Errors.INVALID_TEMPERATURE, payload);
      throw new HttpException(
        Errors.INVALID_TEMPERATURE,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.timerService.start();

    const answer = await this.chatService.generateAnswer(prompt, {
      token,
      temperature,
    });

    const duration = this.timerService.stop();

    this.logger.debug(`Done in ${duration} ms`, payload);

    return { answer, temperature, duration };
  }
}
