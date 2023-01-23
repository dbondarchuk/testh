import {
  ILogger,
  ILoggerFactory,
  ITestProvider,
  LoggerFactoryInjectionToken,
  Service,
  Test,
  TestProviderInjectionToken,
} from '@testh/sdk';
import { inject } from 'tsyringe';
import { YamlInclude } from 'yaml-js-include';

/** Generates a test from the yaml file */
@Service(TestProviderInjectionToken)
export class YamlTestProvider implements ITestProvider {
  private readonly logger: ILogger;

  constructor(
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.get<YamlTestProvider>(YamlTestProvider);
  }

  async get(args: string[]): Promise<Test | undefined> {
    const pathToTest = args[0];
    if (
      (args.length === 1 && pathToTest?.endsWith('.yaml')) ||
      pathToTest?.endsWith('.yml')
    ) {
      this.logger.debug(
        `Passed arguments could be parsed. Parsing YAML file '${pathToTest}'..`,
      );

      const yaml = new YamlInclude();
      const test = await yaml.loadAsync<Test>(pathToTest);

      this.logger.debug('Successfully parsed a yaml file.');
      return test;
    }

    this.logger.debug(
      `Passed arguments aren't supported: ${JSON.stringify(args)}`,
    );
    return undefined;
  }
}
