import { plainToClass } from 'class-transformer';
import {
  ILoggerFactory,
  IState,
  IStepsRunner,
  ITestRunner,
  LoggerFactoryInjectionToken,
  Service,
  StateInjectionToken,
  StepsRunnerInjectionToken,
  Test,
  TestInstanceInjectionToken,
  TestRunnerInjectionToken,
} from '@testh/sdk';
import { container } from 'tsyringe';

/**
 * Default test runner
 */
@Service(TestRunnerInjectionToken)
export class TestRunner extends ITestRunner {
  /** @inheritdoc */
  public async run(test: Test): Promise<boolean> {
    test = plainToClass(Test, test);

    container.registerInstance(TestInstanceInjectionToken, test);

    const state = container.resolve<IState>(StateInjectionToken);

    const loggerFactory = container.resolve<ILoggerFactory>(
      LoggerFactoryInjectionToken,
    );

    const logger = loggerFactory.get<TestRunner>(TestRunner);

    if (test.pages) state.variables.put('pages', test.pages);

    logger.info(`Running a test '${test.name}'...`);

    try {
      await container
        .resolve<IStepsRunner>(StepsRunnerInjectionToken)
        .runTestSteps(test.steps, state, (stepNumber) => stepNumber);

      logger.info('Test execution has successfully completed.');
      return true;
    } catch (e) {
      logger.error(`Test execution has failed: ${e}`);
      return false;
    } finally {
      await state.removeAllDrivers();
    }
  }
}
