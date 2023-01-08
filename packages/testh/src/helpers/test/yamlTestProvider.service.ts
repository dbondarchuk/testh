import {
  ITestProvider,
  Service,
  Test,
  TestProviderInjectionToken,
} from '@testh/sdk';
import { YamlInclude } from 'yaml-js-include';

/** Generates a test from the yaml file */
@Service(TestProviderInjectionToken)
export class YamlTestProvider extends ITestProvider {
  async get(args: string[]): Promise<Test | undefined> {
    const pathToTest = args[0];
    if (pathToTest?.endsWith('.yaml') || pathToTest?.endsWith('.yml')) {
      const yaml = new YamlInclude();
      return await yaml.loadAsync<Test>(pathToTest);
    }

    return undefined;
  }
}
