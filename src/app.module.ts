import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { OpenAIChatService } from './chat.service';
import { TimerService } from './timer.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [OpenAIChatService, TimerService],
})
export class AppModule {}
