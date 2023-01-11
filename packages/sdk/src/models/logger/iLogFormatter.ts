/** Describes a service to format log messages */
export interface ILogFormatter {
  /**
   * Formats a message
   * @param message Message to format
   * @param caller Caller type
   */
  format(message: string, caller: string): string;
}

/** Injection token for log format */
export const LogFormatterInjectionToken = 'LogFormatter';
