import { ILogger } from './iLogger';
import { logLevel, LogLevel } from './logLevel';

/** Aliases for composite logger */
export type ICompositeLogger = ILogger;

/** Default implementation of the composite logger */
export abstract class CompositeLogger implements ICompositeLogger {
  /**
   * Creates a new instance of the CompositeLogger
   * @param loggers Loggers to use
   */
  constructor(protected readonly loggers: LoggerDescriptor[]) {}

  /** @inheritdoc */
  log(message: string, level: LogLevel): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= level) {
        logger.logger.log(message, level);
      }
    }
  }

  /** @inheritdoc */
  debug(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Debug) {
        logger.logger.debug(message);
      }
    }
  }

  /** @inheritdoc */
  info(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Info) {
        logger.logger.info(message);
      }
    }
  }

  /** @inheritdoc */
  warning(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Warning) {
        logger.logger.warning(message);
      }
    }
  }

  /** @inheritdoc */
  error(message: string): void {
    for (const logger of this.loggers) {
      if (logLevel(logger.level) <= LogLevel.Error) {
        logger.logger.error(message);
      }
    }
  }
}

/** Describes a information needed for the composite logger to include specific logger */
export interface LoggerDescriptor {
  /** Logger min level */
  level: LogLevel;

  /** Logger */
  logger: ILogger;
}

/** Describes a service which creates a composite logger from the multiple other loggers */
export interface ICompositeLoggerProvider {
  /**
   * Creates a composite logger
   * @param loggers Loggers to use
   * @returns Logger
   */
  createLogger(loggers: LoggerDescriptor[]): ICompositeLogger;
}

/** Injection token for the composite logger */
export const CompositeLoggerProviderInjectionToken = 'CompositeLoggerProvider';
