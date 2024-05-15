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

@Controller('api/v1/chat')
export class ChatController {
  constructor(
    private readonly chatService: OpenAIChatService,
    private readonly timerService: TimerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  public async chat(
    @Body() chatPayload: ChatPayload,
    @Headers() headers: Record<string, unknown>,
  ) {
    this.timerService.start();

    if (!headers['x-openai-api-key']) {
      throw new HttpException(
        'Missing OpenAI API key in header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { prompt, temperature } = chatPayload;

    if (prompt.length === 0) {
      throw new HttpException('Prompt cannot be empty', HttpStatus.BAD_REQUEST);
    }

    if (temperature <= 0.0) {
      throw new HttpException(
        'Temperature must be greater than 0.0',
        HttpStatus.BAD_REQUEST,
      );
    }

    const answer = await this.chatService.generateAnswer(prompt, {
      temperature,
    });

    const duration = this.timerService.stop();

    return { answer, temperature, duration };
  }
}

