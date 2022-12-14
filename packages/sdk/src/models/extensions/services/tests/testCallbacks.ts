import { IState, Test, TestStep } from '../../../tests';

/** Describes a callback which is executed before test step run*/
export interface IPreStepExecutionCallback {
  /**
   * Executes a callback
   * @param step Test step
   * @param stepNumber Current test step number
   * @returns Modified test step
   */
  execute(step: TestStep, stepNumber: string | number): Promise<TestStep>;
}

/** Injection token for callback before test step run */
export const PreStepExecutionCallbackInjectionToken =
  'IPreStepExecutionCallback';

/** Describes a callback which is executed after test step run*/
export interface IPostStepExecutionCallback {
  /**
   * Executes a callback
   * @param step Test step
   * @param stepNumber Current test step number
   * @param isSuccessful Was the step successful
   * @param errors List of errors if step has failed
   */
  execute(
    step: TestStep,
    stepNumber: string | number,
    isSuccessful: boolean,
    errors?: Error[],
  ): Promise<void>;
}

/** Injection token for callback after test step run */
export const PostStepExecutionCallbackInjectionToken =
  'IPostStepExecutionCallback';

/** Describes a callback which is executed before test run*/
export interface IPreTestExecutionCallback {
  /**
   * Executes a callback
   * @param test Test
   * @param state Current state
   */
  execute(test: Test, state: IState): Promise<Test>;
}

/** Injection token for callback before test run */
export const PreTestExecutionCallbackInjectionToken =
  'IPreTestExecutionCallback';

/** Describes a callback which is executed after test run*/
export interface IPostTestExecutionCallback {
  /**
   * Executes a callback
   * @param test Test
   * @param state Current state
   * @param isSuccessful Was the step successful
   * @param errors List of errors if step has failed
   */
  execute(
    test: Test,
    state: IState,
    isSuccessful: boolean,
    errors: Error[],
  ): Promise<void>;
}

/** Injection token for callback after test run */
export const PostTestExecutionCallbackInjectionToken =
  'IPostTestExecutionCallback';
