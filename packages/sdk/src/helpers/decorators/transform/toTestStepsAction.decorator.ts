import 'reflect-metadata';

import { Transform, TransformationType } from 'class-transformer';
import { resolve } from '../../../containers';
import {
  getCurrentStepNumber,
  InvalidOperationException,
  IState,
  IStepsRunner,
  StepsRunnerInjectionToken,
  TestSteps,
  TestStepsAction,
  updateStepNumber,
} from '../../../models';
import { SkipEvaluate } from '../evaluate/skipEvaluate.decorator';

/**
 * Transforms Test Steps into {@link TestStepsAction}
 * @param value TestSteps
 * @returns `TestStepsAction` Test steps as action
 */
export const toTestStepsAction = (value: TestSteps): TestStepsAction => {
  if (!Array.isArray(value)) {
    throw new InvalidOperationException(
      "Can't convert non-array value into test steps",
    );
  }

  return {
    length: value.length,
    execute: async (state: IState): Promise<any[]> => {
      const baseStepNumber = getCurrentStepNumber(state.variables);
      const stepsRunner = resolve<IStepsRunner>(StepsRunnerInjectionToken);

      const results = await stepsRunner.runTestSteps(
        value as TestSteps,
        state,
        (stepNumber) => `${baseStepNumber}.${stepNumber}`,
      );

      updateStepNumber(state.variables, baseStepNumber);

      return results;
    },
  } as TestStepsAction;
};

/**
 * Decorator to transform test steps into actionable items
 * @returns Transformed object
 */
export function ToTestStepsAction(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    SkipEvaluate()(target, propertyKey);

    Transform((params): TestStepsAction | any => {
      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        const obj = params.obj[params.key];
        if (obj?.execute) return obj;
        const value = obj as TestSteps;

        return toTestStepsAction(value);
      }

      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return params.value;
      }

      return params.value;
    })(target, propertyKey);
  };
}
