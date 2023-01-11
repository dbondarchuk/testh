import { ILogFormatter, LogFormatterInjectionToken, Service } from '@testh/sdk';
import * as moment from 'moment';

/** Standard log formatter to insert caller type and current time */
@Service(LogFormatterInjectionToken)
export class TypeAndTimeLogFormatter implements ILogFormatter {
  /** @inheritdoc */
  format(message: string, caller: string): string {
    return `${moment().toISOString()} - ${caller} - ${message}`;
  }
}
