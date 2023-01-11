import {
  ILogFormatter,
  ILogger,
  LogFormatterInjectionToken,
  logLevel,
  LogLevel,
  resolveAll,
} from '@testh/sdk';

export class CompositeLogger implements ILogger {
  /**
   * Creates a new instance of the CompositeLogger
   * @param loggers Loggers to use
   * @param type Caller type
   */
  constructor(
    protected readonly loggers: LoggerDescriptor[],
    protected readonly type: string,
  ) {}

  /** @inheritdoc */
  log(message: string, level: LogLevel): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= level) {
        logger.logger.log(this.format(message), level);
      }
    }
  }

  /** @inheritdoc */
  debug(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Debug) {
        logger.logger.debug(this.format(message));
      }
    }
  }

  /** @inheritdoc */
  info(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Info) {
        logger.logger.info(this.format(message));
      }
    }
  }

  /** @inheritdoc */
  warning(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Warning) {
        logger.logger.warning(this.format(message));
      }
    }
  }

  /** @inheritdoc */
  error(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Error) {
        logger.logger.error(this.format(message));
      }
    }
  }

  format(message: string): string {
    const formatters = resolveAll<ILogFormatter>(LogFormatterInjectionToken);

    for (const formatter of formatters) {
      message = formatter.format(message, this.type);
    }

    return message;
  }
}

/** Describes a information needed for the composite logger to include specific logger */
export interface LoggerDescriptor {
  /** Logger min level */
  level: LogLevel;

  /** Logger */
  logger: ILogger;
}
