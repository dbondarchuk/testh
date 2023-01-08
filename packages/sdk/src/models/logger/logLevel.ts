/** Logger levels */
export enum LogLevel {
  /** Debug information */
  Debug = 1,

  /** Useful information */
  Info,

  /** Warning messages */
  Warning,

  /** Error */
  Error,
}

export function logLevel(level: string | number | LogLevel): LogLevel {
  if (typeof level === 'string') {
    return LogLevel[level];
  }

  return level;
}

/** Default minimum log level */
export const DefaultMinLogLevel = LogLevel.Info;
