import { container } from 'tsyringe';

import { LoggerFactory } from '../logger/loggerFactory';
import { TestRunState } from '../models/runners/testRunState';
import { Test } from '../models/tests/test';

import './runners';
import { plainToClass } from 'class-transformer';
import {
  IStepsRunner,
  StepsRunnerInjectionToken,
} from '../helpers/steps/iStepsRunner';

/**
 * Default test runner
 */
export class TestRunner {
  protected readonly state: TestRunState;
  protected readonly test: Test;

  constructor(test: Test) {
    this.test = plainToClass(Test, test);
    this.state = new TestRunState(this.test);
  }

  /**
   * Runs a test
   * @returns If execution was successful
   */
  public async run(): Promise<boolean> {
    const loggerFactory = new LoggerFactory();
    const logger = loggerFactory.get<TestRunner>(TestRunner);

    if (this.test.pages) this.state.variables.put('pages', this.test.pages);

    logger.info(`Running a test '${this.test.name}'...`);

    try {
      await container
        .resolve<IStepsRunner>(StepsRunnerInjectionToken)
        .runTestSteps(this.test.steps, this.state, (stepNumber) => stepNumber);

      logger.info('Test execution has successfully completed.');
      return true;
    } catch (e) {
      logger.error(`Test execution has failed: ${e}`);
      return false;
    } finally {
      await this.state.removeAllDrivers();
    }
  }
}
