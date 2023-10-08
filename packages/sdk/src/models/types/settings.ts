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
       * Is extension enabled.
       * @defaultValue `true`
       */
      enabled?: boolean;

      /** Overriden extension priority */
      priority?: number;

      /**
       * Version requirment for the extension to be used.
       * See {@link https://github.com/npm/node-semver} for the description of version constraints
       */
      version?: string;
    };
  };
  [key: string]: any;
};

/** Injection token for settings */
export const SettingsInjectionToken = 'Settings';
