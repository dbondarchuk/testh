import { plainToClass } from 'class-transformer';
import { UnknownOptionException } from '../../models/exceptions/unknownOptionException';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { TestRunState } from '../../models/runners/testRunState';
import { getImplementations } from '../../models/runners/testStepRunnerRegistry';
import { getProperties, TestStep } from '../../models/tests/testStep';
import { updateStepNumber } from '../../models/tests/variables';
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
  steps: TestStep[],
  state: TestRunState,
  logger: ILogger,
  loggerFactory: ILoggerFactory,
  stepNumberFn: (stepNumber: number) => string | number,
): Promise<void> => {
  let isFailed = false;
  let error: Error = undefined;
  let stepNumber = 0;
  for (const step of steps) {
    updateStepNumber(state.variables, stepNumberFn(stepNumber++));

    if (step.disabled) {
      logger.info(`Step '${step.name}' is disabled. Skipping it.`);
      continue;
    }

    if (!step.runOnFailure && isFailed) continue;

    logger.info(`Running a step '${step.name}'`);

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

    const props = plainToClass(
      runnerType.propertiesType,
      await getProperties(step, state.variables),
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
