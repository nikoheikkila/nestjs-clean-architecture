import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ChatService } from './chat.service';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async chat() {
    const answer = await this.chatService.generateAnswer();

    return { answer };
  }
}
