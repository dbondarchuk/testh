import { Extension, ITestProviderExtension, Test } from '@testh/sdk';
import { YamlInclude } from 'yaml-js-include';

/** Generates a test from the yaml file */
@Extension()
export class YamlTestProviderExtension extends ITestProviderExtension {
  async get(args: string[]): Promise<Test | undefined> {
    const pathToTest = args[0];
    if (pathToTest?.endsWith('.yaml') || pathToTest?.endsWith('.yml')) {
      const yaml = new YamlInclude();
      return await yaml.loadAsync<Test>(pathToTest);
    }

    return undefined;
  }

  get name(): string {
    return 'YAML Test Provider';
  }

  get priority(): number {
    return 5;
  }
}
