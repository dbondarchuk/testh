import {
  BaseLogger,
  LoggerInjectionToken,
  LogLevel,
  Service,
} from '@testh/sdk';

/** Console logger */
@Service(LoggerInjectionToken)
export class ConsoleLogger extends BaseLogger {
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

    method(message);
  }
}
