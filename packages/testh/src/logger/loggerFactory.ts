import { Constructor, ILogger, ILoggerFactory } from '@testh/sdk';
import { ConsoleLogger } from './consoleLogger';

/** Default logger factory */
export class LoggerFactory implements ILoggerFactory {
  /** @inheritdoc */
  get<T>(type: Constructor<T>): ILogger {
    return new ConsoleLogger(type.name);
  }
}
