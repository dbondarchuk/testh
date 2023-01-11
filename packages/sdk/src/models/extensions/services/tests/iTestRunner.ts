import { Test } from '../../../tests/test';

/** Describes a service, which runs a test */
export abstract class ITestRunner {
  /**
   * Runs a test
   * @returns Whether the execution was successful
   */
  public abstract run(test: Test): Promise<boolean>;
}

/** Injection token for test provider */
export const TestRunnerInjectionToken = 'TestRunner';
