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
import * as path from 'path';
import { YamlInclude } from 'yaml-js-include';

/** The name of the variable which will contain path to the test directory */
export const TEST_DIRECTORY_VARIABLE = '__dir__';

/**
 * Generates a test from the yaml file
 * @variable {@link TEST_DIRECTORY_VARIABLE} Contains path to the test directory
 */
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

      test.variables = test.variables || {};

      test.variables[TEST_DIRECTORY_VARIABLE] = path.dirname(
        path.resolve(pathToTest),
      );

      this.logger.debug('Successfully parsed a yaml file.');
      return test;
    }

    this.logger.debug(
      `Passed arguments aren't supported: ${JSON.stringify(args)}`,
    );
    return undefined;
  }
}
