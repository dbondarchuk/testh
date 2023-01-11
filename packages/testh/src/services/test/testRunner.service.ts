import { plainToClass } from 'class-transformer';
import {
  ILogger,
  ILoggerFactory,
  IPostTestExecutionCallback,
  IPreTestExecutionCallback,
  IState,
  IStepsRunner,
  ITestRunner,
  LoggerFactoryInjectionToken,
  PostTestExecutionCallbackInjectionToken,
  PreTestExecutionCallbackInjectionToken,
  resolve,
  resolveAll,
  Service,
  StateInjectionToken,
  StepsRunnerInjectionToken,
  Test,
  TestInstanceInjectionToken,
  TestRunnerInjectionToken,
} from '@testh/sdk';
import { container, inject } from 'tsyringe';

/**
 * Default test runner
 */
@Service(TestRunnerInjectionToken)
export class TestRunner extends ITestRunner {
  private readonly logger: ILogger;

  public constructor(
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    super();

    this.logger = loggerFactory.get<TestRunner>(TestRunner);
  }

  /** @inheritdoc */
  public async run(test: Test): Promise<boolean> {
    test = plainToClass(Test, test);

    container.registerInstance(TestInstanceInjectionToken, test);

    const state = container.resolve<IState>(StateInjectionToken);

    if (test.pages) state.variables.put('pages', test.pages);

    this.logger.info(`Running a test '${test.name}'...`);

    try {
      const preCallbacks = resolveAll<IPreTestExecutionCallback>(
        PreTestExecutionCallbackInjectionToken,
      );

      for (const preCallback of preCallbacks) {
        this.logger.debug(
          `Running pre test execution callback ${preCallback.constructor.name}`,
        );
        test = await preCallback.execute(test, state);
      }

      await resolve<IStepsRunner>(StepsRunnerInjectionToken).runTestSteps(
        test.steps,
        state,
        (stepNumber) => stepNumber,
      );

      this.logger.info('Test execution has successfully completed.');
      await this.postCallback(test, state, true);

      return true;
    } catch (e: Error[] | Error | any) {
      const error = Array.isArray(e) ? e.join(';\n') : e;
      this.logger.error(`Test execution has failed: ${error}`);

      await this.postCallback(test, state, false, e);

      return false;
    } finally {
      await state.removeAllDrivers();
    }
  }

  private async postCallback(
    test: Test,
    state: IState,
    isSuccessful: boolean,
    errors?: Error[] | Error | any,
  ): Promise<void> {
    const postCallbacks = resolveAll<IPostTestExecutionCallback>(
      PostTestExecutionCallbackInjectionToken,
    );
    for (const postCallback of postCallbacks) {
      this.logger.debug(
        `Running post test execution callback ${postCallback.constructor.name}`,
      );
      await postCallback.execute(
        test,
        state,
        isSuccessful,
        Array.isArray(errors) ? errors : [errors],
      );
    }
  }
}
