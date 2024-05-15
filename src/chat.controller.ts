import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { ChatService } from './chat.service';

interface ChatPayload {
  prompt: string;
  temperature: number;
}

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async chat(@Body() chatPayload: ChatPayload) {
    const { prompt, temperature } = chatPayload;

    if (prompt.length === 0) {
      throw new HttpException('Prompt cannot be empty', HttpStatus.BAD_REQUEST);
    }

    const answer = await this.chatService.generateAnswer();
    const duration = 500;

    return { answer, temperature, duration };
  }
}
