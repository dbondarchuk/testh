import { LogLevel } from './logLevel';

/** Describes settings for the specific logger */
export type LoggerSettings = Record<string, any> & {
  /** Minimum log level */
  level?: LogLevel;
};

/** Logging settings. Map of Logger type -> Logger settings */
export type LogSettings = Record<string, LoggerSettings> & {
  /** Minimum default log levek */
  level?: LogLevel;
};

/** Injection token for the settings for the specific logger */
export const LoggerSettingsInjectionToken = 'LoggerSettings';
