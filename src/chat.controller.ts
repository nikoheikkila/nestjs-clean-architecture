import {
  BadRequestException,
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatPayload, ChatService, Timer } from './interfaces';
import { OpenAIChatService } from './chat.service';
import { TimerService } from './timer.service';
import { StructuredLogger } from './logger.service';
import * as process from 'node:process';
import { Errors } from './errors';

const OPENAI_API_KEY = 'x-openai-api-key';

@Controller('api/v1/chat')
export class ChatController {
  constructor(
    @Inject(OpenAIChatService) private readonly chatService: ChatService,
    @Inject(TimerService) private readonly timerService: Timer,
    @Inject(StructuredLogger) private readonly logger: LoggerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  public async chat(
    @Req() request: Request,
    @Body() chatPayload: ChatPayload,
    @Headers(OPENAI_API_KEY) token: string,
  ) {
    const payload = {
      method: request.method,
      endpoint: request.url,
      process: process.pid,
    };

    this.logger.debug('Received a new request', payload);

    if (!token) {
      this.logger.error(Errors.MISSING_OPENAI_API_KEY, payload);
      throw new UnauthorizedException(Errors.MISSING_OPENAI_API_KEY);
    }

    const { prompt, temperature } = chatPayload;

    if (!prompt || prompt.length === 0) {
      this.logger.error(Errors.EMPTY_PROMPT, payload);
      throw new BadRequestException(Errors.EMPTY_PROMPT);
    }

    if (temperature <= 0.0) {
      this.logger.error(Errors.INVALID_TEMPERATURE, payload);
      throw new BadRequestException(Errors.INVALID_TEMPERATURE);
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
