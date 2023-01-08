import { LogLevel } from './logLevel';

/**
 * Describes a logger
 */
export interface ILogger {
  /**
   * Writes a debug message
   * @param message Message
   */
  debug(message: string): void;

  /**
   * Writes an informational message
   * @param message Message
   */
  info(message: string): void;

  /**
   * Writes a warning message
   * @param message Message
   */
  warning(message: string): void;

  /**
   * Writes an error message
   * @param message Message
   */
  error(message: string): void;

  /**
   * Writes a logger message with the specified message
   * @param message Message
   * @param level Log level
   */
  log(message: string, level: LogLevel): void;
}

/** Injection token for the logger */
export const LoggerInjectionToken = 'Logger';

/** Injection token for the type of the class where the logger is used */
export const LoggerClassTypeInjectionToken = 'LoggerClassType';
