import { ILogger } from '../models/logger/iLogger';
import { ILoggerFactory } from '../models/logger/iLoggerFactory';
import { Constructor } from '../models/actions/actionRegistry';
import { ConsoleLogger } from './consoleLogger';

/** Default logger factory */
export class LoggerFactory implements ILoggerFactory {
  get<T>(type: Constructor<T>): ILogger {
    return new ConsoleLogger(type.name);
  }
}
