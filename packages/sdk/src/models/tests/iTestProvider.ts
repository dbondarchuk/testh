import { Test } from './test';

/** Describes a service, which provides a test based on arguments */
export abstract class ITestProvider {
  /**
   * Creates a test based on the arguments.
   * If can't provide a test returns undefined
   * @param args Args to create a test
   * @returns Test or undefined if can't create it
   */
  public abstract get(args: string[]): Promise<Test | undefined>;
}

/** Injection token for test provider */
export const TestProviderInjectionToken = 'TestProvider';