import {
  CompositeLogger,
  CompositeLoggerProviderInjectionToken,
  ICompositeLoggerProvider,
  ILogger,
  LoggerDescriptor,
  Service,
} from '@testh/sdk';

class DefaultCompositeLogger extends CompositeLogger {}

@Service(CompositeLoggerProviderInjectionToken)
export class CompositeLoggerProvider implements ICompositeLoggerProvider {
  createLogger(loggers: LoggerDescriptor[]): ILogger {
    return new DefaultCompositeLogger(loggers);
  }
}
