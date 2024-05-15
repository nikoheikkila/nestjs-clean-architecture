import {
  Body,
  Controller,
  Header,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatPayload } from './interfaces';
import { OpenAIChatService } from './chat.service';
import { TimerService } from './timer.service';
import { StructuredLogger } from './logger.service';

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
    @Body() chatPayload: ChatPayload,
    @Headers() headers: Record<string, unknown>,
  ) {
    const token = headers['x-openai-api-key'] as string;

    if (!token) {
      this.logger.error('Missing OpenAI API key in header');
      throw new HttpException(
        'Missing OpenAI API key in header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { prompt, temperature } = chatPayload;

    if (prompt.length === 0) {
      this.logger.error('Prompt cannot be empty');
      throw new HttpException('Prompt cannot be empty', HttpStatus.BAD_REQUEST);
    }

    if (temperature <= 0.0) {
      this.logger.error('Temperature must be greater than 0.0');
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
