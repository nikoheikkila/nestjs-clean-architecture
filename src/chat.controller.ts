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
import { ChatService } from './chat.service';
import { ChatPayload } from './interfaces';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  public async chat(
    @Body() chatPayload: ChatPayload,
    @Headers() headers: Record<string, unknown>,
  ) {
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

    const answer = await this.chatService.generateAnswer();
    const duration = 500;

    return { answer, temperature, duration };
  }
}
