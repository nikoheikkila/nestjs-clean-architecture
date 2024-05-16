import { Injectable } from '@nestjs/common';

import { Timer } from '../contracts/timer.contract';

@Injectable()
export class TimerService implements Timer {
  private startTime: number;

  constructor() {
    this.startTime = 0;
  }

  public start(): void {
    this.startTime = Date.now();
  }

  stop(): number {
    return Date.now() - this.startTime;
  }
}
