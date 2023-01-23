import { inject, container } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import {
  ActionContainerInjectionToken,
  getCurrentStepNumber,
  IActionContainer,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  IPostStepExecutionCallback,
  IPreStepExecutionCallback,
  IPropertiesEvaluator,
  IState,
  IStepsRunner,
  LoggerFactoryInjectionToken,
  PostStepExecutionCallbackInjectionToken,
  PreStepExecutionCallbackInjectionToken,
  PropertiesEvaluatorInjectionToken,
  resolveAll,
  Service,
  StepsNumberFunction,
  StepsRunnerInjectionToken,
  TestSteps,
  UnknownOptionException,
  updateStepNumber,
} from '@testh/sdk';

/** Default test step runner */
@Service(StepsRunnerInjectionToken)
export class StepsRunner implements IStepsRunner {
  private readonly logger: ILogger;
  constructor(
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
    @inject(LoggerFactoryInjectionToken)
    protected readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.get<StepsRunner>(StepsRunner);
  }

  /**
   * Helper to run test steps
   * @param steps Test steps
   * @param state Current state
   * @param stepNumberFn Function to get step number
   */
  public async runTestSteps(
    steps: TestSteps,
    state: IState,
    stepNumberFn: StepsNumberFunction,
  ): Promise<any[]> {
    let isFailed = false;
    let stepNumber = 0;

    const results = [];
    const errors: Error[] = [];

    this.logger.debug(`Running ${steps.length} steps`);

    for (let step of steps) {
      updateStepNumber(state.variables, stepNumberFn(stepNumber++));
      const currentStepNumber = getCurrentStepNumber(state.variables);

      const preCallbacks = resolveAll<IPreStepExecutionCallback>(
        PreStepExecutionCallbackInjectionToken,
      );
      for (const preCallback of preCallbacks) {
        this.logger.debug(
          `Running pre step execution callback ${preCallback.constructor.name}`,
        );
        step = await preCallback.execute(step, currentStepNumber);
      }

      let isStepSuccessul = true;
      let stepErrors = [];

      try {
        if (!step.runOnFailure && isFailed) continue;

        if (!step.type) {
          throw new InvalidOperationException(
            'Test step is not formed properly',
          );
        }

        if (steps.variables) {
          const baseVariables = steps.variables;
          state.variables.merge(baseVariables);
        }

        if (step.disabled) {
          this.logger.info(
            `Step #${currentStepNumber} '${step.name}' is disabled. Skipping it.`,
          );
          continue;
        }

        this.logger.debug(`Looking for the action of type ${step.type}`);

        const runners = container
          .resolve<IActionContainer>(ActionContainerInjectionToken)
          .get();

        const actionType = runners[step.type];
        if (!actionType) {
          throw new UnknownOptionException(
            `Can't find a runner of type '${step.type}'.`,
          );
        }

        this.logger.debug(
          `Resolved action ${actionType.ctor.name} for the type '${step.type}'`,
        );

        if (step.condition) {
          this.logger.debug(`Verifying condition '${step.condition}'`);
          const conditionResult = await this.propertiesEvaluator.evaluate(
            step.condition,
            state.variables.variables,
          );

          if (!conditionResult) {
            this.logger.info(
              `Step condition wasn't successful. Skipping step.`,
            );
            continue;
          }

          this.logger.info('Step condition was successful');
        }

        const propsPlain = await this.propertiesEvaluator.evaluateProperties(
          step.values,
          state,
          actionType.propertiesType,
        );

        this.logger.info(`Running a step #${currentStepNumber} '${step.name}'`);

        const props = plainToClass(actionType.propertiesType, propsPlain);

        this.logger.debug(`Running action ${actionType.ctor.name}`);

        const runner = new actionType.ctor(props, this.loggerFactory);
        const result = await runner.run(state, step);
        results.push(result);

        this.logger.debug(`Step has completed successfully`);
      } catch (e) {
        isFailed = !isFailed && !step.ignoreError;
        errors.push(e);

        this.logger.error(`Step ${step.name} has failed: ${e}`);

        isStepSuccessul = false;
        stepErrors = Array.isArray(e) ? e : [e];
      } finally {
        const postCallbacks = resolveAll<IPostStepExecutionCallback>(
          PostStepExecutionCallbackInjectionToken,
        );
        for (const postCallback of postCallbacks) {
          this.logger.debug(
            `Running post step execution callback ${postCallback.constructor.name}`,
          );
          await postCallback.execute(
            step,
            currentStepNumber,
            isStepSuccessul,
            stepErrors,
          );
        }
      }
    }

    if (isFailed) {
      this.logger.error(`Steps execution failed: ${errors.join(';\n')}`);
      throw errors;
    }

    return results;
  }
}
