import * as moment from 'moment';
import { ILogger } from '../models/logger/iLogger';

/** Console logger */
export class ConsoleLogger implements ILogger {
  /**
   * Creates a new Console Logger
   * @param typeName Name of the type where execution is happening
   */
  constructor(private readonly typeName: string) { }

  /** @inheritdoc */
  info(message: string): void {
    console.log(this.format(message));
  }

  /** @inheritdoc */
  warning(message: string): void {
    console.warn(this.format(message));
  }

  /** @inheritdoc */
  error(message: string): void {
    console.error(this.format(message));
  }

  private format(message: string): string {
    return `${moment().toISOString()} - ${this.typeName} - ${message}`;
  }
}
