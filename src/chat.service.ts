import { Injectable } from '@nestjs/common';
import { ChatOptions, ChatService } from "./interfaces";

@Injectable()
export class OpenAIChatService implements ChatService {
  public async generateAnswer(prompt: string, options: ChatOptions): Promise<string> {
    return 'Hello, I am ChatGPT';
  }
}
