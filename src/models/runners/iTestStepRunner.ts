import { TestRunState } from './testRunState';
import { TestStep } from '../tests/testStep';
import { ITestStepRunnerProperties } from './ITestStepRunnerProperties';

/**
 * Base class for the test step runners
 */
export abstract class ITestStepRunner<
  Props extends ITestStepRunnerProperties,
  T = void,
> {
  /**
   * @param props Properties
   */
  constructor(protected readonly props: Props) {}

  /**
   * Test step entry point
   * @param state Current state
   * @param step Test step
   * @returns
   */
  public abstract run(state: TestRunState, step: TestStep): Promise<T>;
}
