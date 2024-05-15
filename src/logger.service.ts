import { LoggerService, LogLevel } from '@nestjs/common';

type Dictionary = Record<string, unknown>;

export class StructuredLogger implements LoggerService {
  public debug(message: string, ...optionalParams: any[]): void {
    console.debug(this.structure(message, 'debug', optionalParams));
  }

  public error(message: string, ...optionalParams: any[]): void {
    console.error(this.structure(message, 'error', optionalParams));
  }

  public fatal(message: string, ...optionalParams: any[]): void {
    console.error(this.structure(message, 'fatal', optionalParams));
  }

  public log(message: string, ...optionalParams: any[]): void {
    console.log(this.structure(message, 'log', optionalParams));
  }

  public verbose(message: string, ...optionalParams: any[]): void {
    console.debug(this.structure(message, 'verbose', optionalParams));
  }

  public warn(message: string, ...optionalParams: any[]): void {
    console.warn(this.structure(message, 'warn', optionalParams));
  }

  private structure(message: string, level: LogLevel, ...extra: any[]): string {
    const extraParameters = extra.length > 0 ? extra[0] : [];

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      extra: extraParameters,
    });
  }
}
