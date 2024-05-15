import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatControllerController } from './chat-controller/chat-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, ChatControllerController],
  providers: [AppService],
})
export class AppModule {}
