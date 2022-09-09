import { TestRunState } from '../../models/runners/testRunState';
import { TestSteps } from '../../models/tests/testSteps';

/** Type for function which generates step number */
export type StepsNumberFunction = (stepNumber: number) => string | number;

/** Describes steps runner */
export abstract class IStepsRunner {
  /**
   * Executes test steps
   * @param steps Test steps to run
   * @param state Current state
   * @param stepNumberFn Function to generate step number
   * @returns Steps execution results
   */
  public abstract runTestSteps(
    steps: TestSteps,
    state: TestRunState,
    stepNumberFn: StepsNumberFunction,
  ): Promise<any[]>;
}

/** Token to use in order to get steps runner implementation from DI container */
export const StepsRunnerInjectionToken = 'StepsRunner';
