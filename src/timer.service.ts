import { Injectable } from '@nestjs/common';
import { Timer } from './interfaces';

@Injectable()
export class TimerService implements Timer {
  private isRunning: boolean;
  private startTime: number;

  constructor() {
    this.isRunning = false;
    this.startTime = 0;
  }

  public start(): void {
    if (this.isRunning) {
      throw new Error('Timer is already running');
    }

    this.startTime = Date.now();
    this.isRunning = true;
  }

  stop(): number {
    if (!this.isRunning) {
      throw new Error('Timer is not running');
    }

    this.isRunning = false;
    return Date.now() - this.startTime;
  }
}
