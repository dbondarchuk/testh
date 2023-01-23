import 'reflect-metadata';

import { Transform, TransformationType } from 'class-transformer';
import { resolve } from '../../../containers';
import {
  Condition,
  getCurrentStepNumber,
  IState,
  IStepsRunner,
  StepsRunnerInjectionToken,
  TestSteps,
  updateStepNumber,
} from '../../../models';
import { SkipEvaluate } from '../evaluate/skipEvaluate.decorator';

function toCondition(value: any): Condition | Condition[] {
  switch (typeof value) {
    case 'object':
      if (Array.isArray(value)) {
        const result: Condition[] = [];
        for (const item of value) {
          result.push(toCondition(item) as Condition);
        }

        return result;
      }

      return async (state: IState): Promise<boolean> => {
        const baseStepNumber = getCurrentStepNumber(state.variables);
        const stepsRunner = resolve<IStepsRunner>(StepsRunnerInjectionToken);

        const results = await stepsRunner.runTestSteps(
          [value] as TestSteps,
          state,
          (stepNumber) => `${baseStepNumber}-condition-${stepNumber}`,
        );

        updateStepNumber(state.variables, baseStepNumber);

        return results[results.length - 1];
      };

    default:
      return async (): Promise<boolean> => !!value;
  }
}

/**
 * Decorator to transform condition item
 * @returns Transformed object
 */
export function ToCondition(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    SkipEvaluate()(target, propertyKey);

    Transform((params): Condition | any => {
      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        return toCondition(params.value);
      }

      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return params.value;
      }

      return params.value;
    })(target, propertyKey);
  };
}
