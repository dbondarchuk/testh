import { plainToClass } from 'class-transformer';
import { UnknownOptionException } from '../../models/exceptions/unknownOptionException';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { TestRunState } from '../../models/runners/testRunState';
import { getImplementations } from '../../models/runners/testStepRunnerRegistry';
import { getProperties } from '../../models/tests/testStep';
import { TestSteps } from "../../models/tests/testSteps";
import { getCurrentStepNumber, updateStepNumber } from '../../models/variables/variablesContainer';
import { JsEngine } from '../js/jsEngine';

/** Type for function which generates step number */
export type StepsNumberFunction = (stepNumber: number) => string | number;

const executeIfNeed = async (prop: any, state: TestRunState, logger: ILogger, loggerFactory: ILoggerFactory, baseStepNumber: string | number): Promise<any> => {
  const stepsFn = (stepNumber) => `${baseStepNumber}-execute-${stepNumber}`;

  if (Object.keys(prop).length == 1 && prop['__execute__']) {
    let evaluated = await JsEngine.evaluateProperties(prop['__execute__'], state.variables);
    if (!Array.isArray(evaluated)) {
      evaluated = [evaluated];
    }

    const results = await runTestSteps(evaluated, state, logger, loggerFactory, stepsFn);

    if (results.length > 1) {
      return results[0];
    }

    return results.length > 1 ? results : results[0];
  } else if (typeof prop === 'object') {
    if (Array.isArray(prop)) {
      for (const index in prop) {
        prop[index] = await executeIfNeed(prop[index], state, logger, loggerFactory, stepsFn(index));
      }
    } else {
      const keys = Object.keys(prop);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == 'steps') continue;
        prop[keys[i]] = await executeIfNeed(prop[keys[i]], state, logger, loggerFactory, stepsFn(i));
      }
    }
  }

  return prop;
}

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
  stepNumberFn: StepsNumberFunction,
): Promise<any[]> => {
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

    try {
      const propsPlain = await getProperties(step, state.variables);
      for (const key in propsPlain) {
        if (key == 'steps') continue;
        propsPlain[key] = await executeIfNeed(propsPlain[key], state, logger, loggerFactory, currentStepNumber);
      }
  
      const props = plainToClass(
        runnerType.propertiesType,
        propsPlain,
      );
  
      const runner = new runnerType.ctor(props, loggerFactory);
      const result = await runner.run(state, step);
      results.push(result);
    } catch (e) {
      isFailed = !isFailed && !step.ignoreError;
      error = e;
    }
  }

  if (isFailed) {
    logger.error(`Step execution failed: ${error}`);
    throw error;
  }

  return results;
};
