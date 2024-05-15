import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { OpenAIChatService } from './chat.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [OpenAIChatService],
})
export class AppModule {}
