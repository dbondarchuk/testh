import { IState } from '../../../tests/iState';
import { TestSteps } from '../../../tests/testSteps';

/** Type for function which generates step number */
export type StepsNumberFunction = (stepNumber: number) => string | number;

/** Describes steps runner */
export interface IStepsRunner {
  /**
   * Executes test steps
   * @param steps Test steps to run
   * @param state Current state
   * @param stepNumberFn Function to generate step number
   * @returns Steps execution results
   */
  runTestSteps(
    steps: TestSteps,
    state: IState,
    stepNumberFn: StepsNumberFunction,
  ): Promise<any[]>;
}

/** Token to use in order to get steps runner implementation from DI container */
export const StepsRunnerInjectionToken = 'StepsRunner';
