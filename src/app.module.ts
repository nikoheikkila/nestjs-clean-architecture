import { Module } from '@nestjs/common';
import { ChatController, OpenAIChatService } from './chat';
import { TimerService } from './timer';
import { StructuredLogger } from './logger';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [OpenAIChatService, TimerService, StructuredLogger],
})
export class AppModule {}
