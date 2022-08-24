import * as moment from 'moment';
import { ILogger } from '../models/logger/iLogger';

export class ConsoleLogger implements ILogger {
  constructor(private readonly typeName: string) {}

  info(message: string): void {
    console.log(this.format(message));
  }

  warning(message: string): void {
    console.warn(this.format(message));
  }

  error(message: string): void {
    console.error(this.format(message));
  }

  private format(message: string) {
    return `${moment().toISOString()} - ${this.typeName} - ${message}`;
  }
}
