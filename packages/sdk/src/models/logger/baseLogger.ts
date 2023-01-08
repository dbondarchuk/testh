import { ILogger } from './iLogger';
import { LogLevel } from './logLevel';

/** Base logger which logs messages with specific level */
export abstract class BaseLogger implements ILogger {
  /** @inheritdoc */
  debug(message: string): void {
    this.log(message, LogLevel.Debug);
  }

  /** @inheritdoc */
  info(message: string): void {
    this.log(message, LogLevel.Info);
  }

  /** @inheritdoc */
  warning(message: string): void {
    this.log(message, LogLevel.Warning);
  }

  /** @inheritdoc */
  error(message: string): void {
    this.log(message, LogLevel.Error);
  }

  /** @inheritdoc */
  abstract log(message: string, level: LogLevel): void;
}
