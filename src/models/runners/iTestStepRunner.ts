import { TestRunState } from './testRunState';
import { TestStep, TestSteps } from '../tests/testStep';
import { Transform } from 'class-transformer';

/**
 * Base type for test step runner properties
 */
export type ITestStepRunnerProperties = Record<string, any>;

/**
 * Describes a class for step runner properties which runs additional test steps
 */
export class TestStepWithStepsProperties implements ITestStepRunnerProperties {
  /**
   * Steps to run
   */
  @Transform((params) => { return params.obj[params.key]; })
  steps: TestSteps;
}

/**
 * Base class for the test step runners
 */
export abstract class ITestStepRunner<Props extends ITestStepRunnerProperties> {
  /**
   * @param props Properties
   */
  constructor(protected readonly props: Props) {}

  /**
   * Test step entry point
   * @param state Current state
   * @param step Test step
   */
  public abstract run(state: TestRunState, step: TestStep): Promise<void>;
}
