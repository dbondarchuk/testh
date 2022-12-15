import { Constructor } from '../actions/actionRegistry';
import { ILogger } from './iLogger';

/**
 * Describes a logger factory
 */
export interface ILoggerFactory {
  /**
   * Gets a new logger for specified type
   * @param type Type for the logger
   */
  get<T>(type: Constructor<T>): ILogger;
}

/** Token to use in order to get logger factory implementation from DI container */
export const LoggerFactoryInjectionToken = 'LoggerFactory';
