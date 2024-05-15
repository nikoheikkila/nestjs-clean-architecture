import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  generateAnswer(): string {
    return 'Hello, I am ChatGPT';
  }
}
