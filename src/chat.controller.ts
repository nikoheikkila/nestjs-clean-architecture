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

    this.logger.debug('Received request', payload);

    const token = headers['x-openai-api-key'] as string;

    if (!token) {
      this.logger.error('Missing OpenAI API key in header', payload);
      throw new HttpException(
        'Missing OpenAI API key in header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { prompt, temperature } = chatPayload;

    if (prompt.length === 0) {
      this.logger.error('Prompt cannot be empty', payload);
      throw new HttpException('Prompt cannot be empty', HttpStatus.BAD_REQUEST);
    }

    if (temperature <= 0.0) {
      this.logger.error('Temperature must be greater than 0.0', payload);
      throw new HttpException(
        'Temperature must be greater than 0.0',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.timerService.start();

    const answer = await this.chatService.generateAnswer(prompt, {
      token,
      temperature,
    });

    const duration = this.timerService.stop();

    return { answer, temperature, duration };
  }
}
