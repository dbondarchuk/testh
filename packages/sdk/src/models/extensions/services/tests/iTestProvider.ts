import { Test } from '../../../tests/test';

/** Describes a service, which provides a test based on arguments */
export interface ITestProvider {
  /**
   * Creates a test based on the arguments.
   * If can't provide a test returns undefined
   * @param args Args to create a test
   * @returns Test or undefined if can't create it
   */
  get(args: string[]): Promise<Test | undefined>;
}

/** Injection token for test provider */
export const TestProviderInjectionToken = 'TestProvider';
