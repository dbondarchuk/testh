import { Constructor } from '../runners/testStepRunnerRegistry';
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
