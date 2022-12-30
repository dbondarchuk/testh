import { container } from 'tsyringe';

import './runners';
import { plainToClass } from 'class-transformer';
import { ILoggerFactory, IState, IStepsRunner, LoggerFactoryContainerToken, StepsRunnerContainerToken, Test } from '@testh/sdk';
import { State } from '../models/state';

/**
 * Default test runner
 */
export class TestRunner {
  protected readonly state: IState;
  protected readonly test: Test;

  constructor(test: Test) {
    this.test = plainToClass(Test, test);
    this.state = new State(this.test);
  }

  /**
   * Runs a test
   * @returns If execution was successful
   */
  public async run(): Promise<boolean> {
    const loggerFactory = container.resolve<ILoggerFactory>(LoggerFactoryContainerToken);
    const logger = loggerFactory.get<TestRunner>(TestRunner);

    if (this.test.pages) this.state.variables.put('pages', this.test.pages);

    logger.info(`Running a test '${this.test.name}'...`);

    try {
      await container
        .resolve<IStepsRunner>(StepsRunnerContainerToken)
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
