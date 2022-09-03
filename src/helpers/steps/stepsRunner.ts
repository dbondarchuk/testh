import { plainToClass } from 'class-transformer';
import { UnknownOptionException } from '../../models/exceptions/unknownOptionException';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { TestRunState } from '../../models/runners/testRunState';
import { getImplementations } from '../../models/runners/testStepRunnerRegistry';
import { getProperties, TestSteps } from '../../models/tests/testStep';
import { getCurrentStepNumber, updateStepNumber } from '../../models/variables/variablesContainer';
import { JsEngine } from '../js/jsEngine';

/**
 * Helper to run test steps
 * @param steps Test steps
 * @param state Current state
 * @param logger Logger
 * @param loggerFactory Logger factory
 * @param stepNumberFn Function to get step number
 */
export const runTestSteps = async (
  steps: TestSteps,
  state: TestRunState,
  logger: ILogger,
  loggerFactory: ILoggerFactory,
  stepNumberFn: (stepNumber: number) => string | number,
): Promise<void> => {
  let isFailed = false;
  let error: Error = undefined;
  let stepNumber = 0;
  
  for (const step of steps) {

    if (steps.variables) {
      const baseVariables = steps.variables;
      state.variables.merge(baseVariables);
    }
  
    updateStepNumber(state.variables, stepNumberFn(stepNumber++));

    const currentStepNumber = getCurrentStepNumber(state.variables);
    if (step.disabled) {
      logger.info(`Step #${currentStepNumber} '${step.name}' is disabled. Skipping it.`);
      continue;
    }

    if (!step.runOnFailure && isFailed) continue;

    logger.info(`Running a step #${currentStepNumber} '${step.name}'`);

    const runners = getImplementations();

    const runnerType = runners[step.type];
    if (!runnerType) {
      throw new UnknownOptionException(
        `Can't find a runner of type '${step.type}'.`,
      );
    }

    if (step.condition) {
      const conditionResult = await JsEngine.evaluate(
        step.condition,
        state.variables.variables,
      );
      if (!conditionResult) {
        logger.info(`Step condition wasn't successful. Skipping step.`);
        continue;
      }
    }

    const propsPlain = await getProperties(step, state.variables);
    const props = plainToClass(
      runnerType.propertiesType,
      propsPlain,
    );

    const runner = new runnerType.ctor(props, loggerFactory);

    try {
      await runner.run(state, step);
    } catch (e) {
      isFailed = !isFailed && !step.ignoreError;
      error = e;
    }
  }

  if (isFailed) {
    logger.error(`Step execution failed: ${error}`);
    throw error;
  }
};
