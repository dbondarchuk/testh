import { LoggerFactory } from '../logger/loggerFactory';
import { TestRunState } from '../models/runners/testRunState';
import { Test } from '../models/tests/test';

import './runners';
import { runTestSteps } from '../helpers/steps/stepsRunner';
import { plainToClass } from 'class-transformer';

export class TestRunner {
  protected readonly state: TestRunState;
  protected readonly test: Test;

  constructor(test: Test) {
    this.test = plainToClass(Test, test);
    this.state = new TestRunState(this.test);
  }

  public async run(): Promise<boolean> {
    const loggerFactory = new LoggerFactory();
    const logger = loggerFactory.get<TestRunner>(TestRunner);

    // const pages = this.test.pages.reduce((record, current) => {
    //   record[current.name] = {
    //     actions: current.actions,
    //     variables: current.variables
    //   };

    //   return record;
    // }, {});

    if (this.test.pages) this.state.variables.put('pages', this.test.pages);

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
