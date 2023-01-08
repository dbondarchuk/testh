import {
  BaseLogger,
  LoggerClassTypeInjectionToken,
  LoggerInjectionToken,
  LogLevel,
  Service,
} from '@testh/sdk';
import * as moment from 'moment';
import { inject } from 'tsyringe';

/** Console logger */
@Service(LoggerInjectionToken)
export class ConsoleLogger extends BaseLogger {
  /**
   * Creates a new Console Logger
   * @param typeName Name of the type where execution is happening
   */
  constructor(
    @inject(LoggerClassTypeInjectionToken) private readonly typeName: string,
  ) {
    super();
  }

  /** @inheritdoc */
  log(message: string, level: LogLevel): void {
    let method: (message: string) => void;
    switch (level) {
      case LogLevel.Debug:
        method = console.debug;
        break;
      case LogLevel.Warning:
        method = console.warn;
        break;
      case LogLevel.Error:
        method = console.error;
        break;
      case LogLevel.Info:
      default:
        method = console.info;
        break;
    }

    method(this.format(message));
  }

  private format(message: string): string {
    return `${moment().toISOString()} - ${this.typeName} - ${message}`;
  }
}
