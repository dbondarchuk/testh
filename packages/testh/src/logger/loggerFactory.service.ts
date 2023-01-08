import {
  CompositeLoggerProviderInjectionToken,
  Constructor,
  DefaultMinLogLevel,
  ICompositeLoggerProvider,
  ILogger,
  ILoggerFactory,
  LoggerClassTypeInjectionToken,
  LoggerDescriptor,
  LoggerFactoryInjectionToken,
  LoggerInjectionToken,
  LoggerSettings,
  LoggerSettingsInjectionToken,
  LogSettings,
  Service,
  Settings,
  SettingsInjectionToken,
} from '@testh/sdk';
import { ClassProvider, container, inject } from 'tsyringe';
import { Registration } from 'tsyringe/dist/typings/dependency-container';
import { constructor } from 'tsyringe/dist/typings/types';

/** Default logger factory */
@Service(LoggerFactoryInjectionToken)
export class LoggerFactory implements ILoggerFactory {
  constructor(
    @inject(SettingsInjectionToken) private readonly settings: Settings,
  ) {}
  /** @inheritdoc */
  get<T>(type: Constructor<T>): ILogger {
    const loggerSettings = this.settings?.logger as LogSettings;
    const minLevel = loggerSettings?.level ?? DefaultMinLogLevel;

    const loggersTypes: Registration<ILogger>[] =
      container['getAllRegistrations'](LoggerInjectionToken);
    const loggers: LoggerDescriptor[] = loggersTypes.map((loggerType) => {
      const childContainer = container
        .createChildContainer()
        .registerInstance(LoggerClassTypeInjectionToken, type.name);

      const loggerFullTypeName = (
        (loggerType.provider as ClassProvider<ILogger>)
          .useClass as constructor<ILogger>
      ).name;
      if (!loggerFullTypeName)
        return {
          level: minLevel,
          logger: childContainer['resolveRegistration'](
            loggerType,
            {},
          ) as ILogger,
        };

      const loggerTypeName = loggerFullTypeName.endsWith('Logger')
        ? loggerFullTypeName.substring(
            0,
            loggerFullTypeName.length - 'Logger'.length,
          )
        : loggerFullTypeName;
      const settings =
        loggerSettings?.[loggerTypeName] ?? ({} as LoggerSettings);
      if (!settings?.level) {
        settings.level = minLevel;
      }

      const logger = childContainer
        .registerInstance(LoggerSettingsInjectionToken, settings)
        .createChildContainer()
        ['resolveRegistration'](loggerType, {});

      return {
        level: settings.level,
        logger: logger,
      };
    });

    const logger = container
      .resolve<ICompositeLoggerProvider>(CompositeLoggerProviderInjectionToken)
      .createLogger(loggers);

    return logger;
  }
}
