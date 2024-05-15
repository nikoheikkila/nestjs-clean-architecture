import { LoggerService, LogLevel } from '@nestjs/common';

type Dictionary = Record<string, unknown>;

export class StructuredLogger implements LoggerService {
  public debug(message: any, optionalParams: Dictionary = {}): void {
    console.debug(this.structure(message, 'debug', optionalParams));
  }

  public error(message: any, optionalParams: Dictionary = {}): void {
    console.error(this.structure(message, 'error', optionalParams));
  }

  public fatal(message: any, optionalParams: Dictionary = {}): void {
    console.error(this.structure(message, 'fatal', optionalParams));
  }

  public log(message: any, optionalParams: Dictionary = {}): void {
    console.log(this.structure(message, 'log', optionalParams));
  }

  public verbose(message: any, optionalParams: Dictionary = {}): void {
    console.debug(this.structure(message, 'verbose', optionalParams));
  }

  public warn(message: any, optionalParams: Dictionary = {}): void {
    console.warn(this.structure(message, 'warn', optionalParams));
  }

  private structure(
    message: string,
    level: LogLevel,
    extra: Dictionary,
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...extra,
    });
  }
}
