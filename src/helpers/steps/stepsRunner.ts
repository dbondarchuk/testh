import { injectable, inject } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import { UnknownOptionException } from '../../models/exceptions/unknownOptionException';
import { ILogger } from '../../models/logger/iLogger';
import {
  ILoggerFactory,
  LoggerFactoryInjectionToken,
} from '../../models/logger/iLoggerFactory';
import { State } from '../../models/actions/testRunState';
import { getImplementations } from '../../models/actions/actionRegistry';
import { TestSteps } from '../../models/tests/testSteps';
import {
  getCurrentStepNumber,
  updateStepNumber,
} from '../../models/variables/variablesContainer';
import { StepsNumberFunction } from './iStepsRunner';
import {
  IPropertiesEvaluator,
  PropertiesEvaluatorInjectionToken,
} from '../properties/iPropertiesEvaluator';

/** Default test step runner */
@injectable()
export class StepsRunner {
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
    state: State,
    stepNumberFn: StepsNumberFunction,
  ): Promise<any[]> {
    let isFailed = false;
    let error: Error = undefined;
    let stepNumber = 0;

    const results = [];

    for (const step of steps) {
      if (steps.variables) {
        const baseVariables = steps.variables;
        state.variables.merge(baseVariables);
      }

      updateStepNumber(state.variables, stepNumberFn(stepNumber++));

      const currentStepNumber = getCurrentStepNumber(state.variables);
      if (step.disabled) {
        this.logger.info(
          `Step #${currentStepNumber} '${step.name}' is disabled. Skipping it.`,
        );
        continue;
      }

      if (!step.runOnFailure && isFailed) continue;

      this.logger.info(`Running a step #${currentStepNumber} '${step.name}'`);

      const runners = getImplementations();

      const runnerType = runners[step.type];
      if (!runnerType) {
        throw new UnknownOptionException(
          `Can't find a runner of type '${step.type}'.`,
        );
      }

      if (step.condition) {
        const conditionResult = await this.propertiesEvaluator.evaluate(
          step.condition,
          state.variables.variables,
        );
        if (!conditionResult) {
          this.logger.info(`Step condition wasn't successful. Skipping step.`);
          continue;
        }
      }

      try {
        const propsPlain = await this.propertiesEvaluator.evaluateProperties(
          step.values,
          state,
        );

        const props = plainToClass(runnerType.propertiesType, propsPlain);

        const runner = new runnerType.ctor(props, this.loggerFactory);
        const result = await runner.run(state, step);
        results.push(result);
      } catch (e) {
        isFailed = !isFailed && !step.ignoreError;
        error = e;
      }
    }

    if (isFailed) {
      this.logger.error(`Step execution failed: ${error}`);
      throw error;
    }

    return results;
  }
}
