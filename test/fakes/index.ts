import { ChatService } from '../../src/contracts/chat.contract';
import { Timer } from '../../src/contracts/timer.contract';
import { LoggerService } from '@nestjs/common';
import { StructuredLogger } from '../../src/logger';
import * as os from 'node:os';

export class FakeChatService implements ChatService {
  async generateAnswer(prompt: string): Promise<string> {
    return `Response: ${prompt}`;
  }
}

export class FakeTimerService implements Timer {
  start() {}

  stop() {
    return 1000;
  }
}

export class NullLogger extends StructuredLogger implements LoggerService {
  private readonly _messages: string[];

  constructor() {
    super();
    this._messages = [];
  }

  public messages(): string {
    return this._messages.join(os.EOL);
  }

  public debug(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'debug', optionalParams));
  }

  public error(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'error', optionalParams));
  }

  public fatal(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'fatal', optionalParams));
  }

  public log(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'log', optionalParams));
  }

  public verbose(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'verbose', optionalParams));
  }

  public warn(message: string, ...optionalParams: any[]): void {
    this._messages.push(this.structure(message, 'warn', optionalParams));
  }
}
