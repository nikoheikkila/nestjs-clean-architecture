import { Module } from '@nestjs/common';
import { ChatController, OpenAIChatService } from './chat';
import { TimerService } from './timer';
import { StructuredLogger } from './logger';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [ChatController, AppController],
  providers: [OpenAIChatService, TimerService, StructuredLogger],
})
export class AppModule {}
