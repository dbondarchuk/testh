import { LoggerSettings } from '../logger/loggerSettings';

/** Describes application settings */
export type Settings = {
  /** Logger settins */
  logger?: LoggerSettings;
  /** Extensions' settings */
  extensions?: {
    /** Extension name */
    [name: string]: {
      /**
       * Is extension enable.
       * @default true
       */
      enabled?: boolean;
      /** Overriden extension priority */
      priority?: number;
    };
  };
  [key: string]: any;
};

/** Injection token for settings */
export const SettingsInjectionToken = 'Settings';
