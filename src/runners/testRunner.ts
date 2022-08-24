import { LoggerFactory } from '../logger/loggerFactory';
import { TestRunState } from '../models/runners/testRunState';
import { Test } from '../models/tests/test';

import 'reflect-metadata';
import './runners';
import { runTestSteps } from '../helpers/steps/stepsRunner';

export class TestRunner {
  protected readonly state: TestRunState;

  constructor(protected readonly test: Test) {
    this.state = new TestRunState(test);
  }

  public async run(): Promise<boolean> {
    const loggerFactory = new LoggerFactory();
    const logger = loggerFactory.get<TestRunner>(TestRunner);

    logger.info(`Running a test '${this.test.name}'...`);

    try {
      await runTestSteps(
        this.test.steps,
        this.state,
        logger,
        loggerFactory,
        (stepNumber) => stepNumber,
      );

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
