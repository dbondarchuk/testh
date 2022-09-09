import { singleton, container } from 'tsyringe';

import { TestRunState } from '../../models/runners/testRunState';
import { TestSteps } from '../../models/tests/testSteps';
import { getCurrentStepNumber } from '../../models/variables/variablesContainer';
import { WrapperWithVariables } from '../../models/variables/wrapperWithVariables';
import { IStepsRunner, StepsRunnerInjectionToken } from '../steps/iStepsRunner';
import { IPropertiesEvaluator } from './iPropertiesEvaluator';

interface ReplacedProperty {
  key: string;
  value: any;
}

/** Default properties evaluator */
@singleton()
export class PropertiesEvaluator implements IPropertiesEvaluator {
  private static async replaceAllAsync(
    str: string,
    regex: RegExp,
    asyncFn: (match: string, group: string) => Promise<string>,
  ): Promise<string> {
    const promises = [];
    str.replaceAll(regex, (match, group) => {
      const promise = asyncFn(match, group);
      promises.push(promise);
      return match;
    });
    const data = await Promise.all(promises);
    return str.replaceAll(regex, () => data.shift());
  }

  public evaluate(
    code: string,
    context: Record<string, any> = {},
  ): Promise<any> {
    return function evaluateEval() {
      const argsStr = Object.keys(context)
        .map((key) => `${key} = this.${key}`)
        .join(',');
      const argsDef = argsStr ? `let ${argsStr};` : '';

      const result = eval(`(async () => {${argsDef} return ${code}})`);
      return result();
    }.call(context);
  }

  public async replaceVariables(
    value: string,
    state: TestRunState,
    recursive = true,
  ): Promise<string | any | undefined> {
    if (!value) return undefined;

    const pattern = /\$\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;

    let replacedValue;
    let wasReplaced = false;

    const replaced = await PropertiesEvaluator.replaceAllAsync(
      value,
      pattern,
      async (match, group) => {
        let result = await this.evaluate(
          group.toString().replaceAll('\\$', '\\\\\\$'),
          state.variables.variables,
        );

        if (recursive) {
          result = await this.evaluateProperties(result, state);
        }

        if (match === value) {
          replacedValue = result;
          wasReplaced = true;
        }

        return result;
      },
    );

    return wasReplaced ? replacedValue : replaced;
  }

  public async evaluateProperties(
    obj: any,
    state: TestRunState,
    recursive = true,
  ): Promise<any> {
    if (!state.variables) return obj;
    let newValue: any;

    switch (typeof obj) {
      case 'string':
        newValue = await this.replaceVariables(obj, state, recursive);
        break;

      case 'object':
        if (!recursive) {
          newValue = obj;
          break;
        }

        if (Array.isArray(obj)) {
          newValue = [];
          if (Object.hasOwn(obj, 'variables')) {
            newValue = [] as WrapperWithVariables<any>;

            // @ts-expect-error Property is verified
            newValue.variables = obj.variables;
          }

          for (const item of obj as any[]) {
            newValue.push(
              await this.evaluateProperties(item, state, recursive),
            );
          }
        } else {
          newValue = {};
          for (const key in obj) {
            const evaluated = await this.evaluateProperty(
              obj[key],
              key,
              state,
              recursive,
            );
            newValue[evaluated.key] = evaluated.value;
          }
        }

        break;

      case 'number':
      case 'boolean':
      default:
        newValue = obj;
        break;
    }

    return newValue;
  }

  private async evaluateProperty(
    value: any,
    key: string,
    state: TestRunState,
    recursive: boolean,
  ): Promise<ReplacedProperty> {
    const stepsRunner = container.resolve<IStepsRunner>(
      StepsRunnerInjectionToken,
    );

    let newKey: string;
    let newValue: any;
    if (key.startsWith('$') && typeof value === 'string') {
      newKey = key.substring(1);
      let evaluated = await this.evaluate(value, state.variables.variables);

      if (recursive && newKey !== 'steps') {
        evaluated = await this.evaluateProperties(evaluated, state);
      }

      newValue = evaluated;
    } else if (key.startsWith('^') || key.startsWith('<')) {
      newKey = key.substring(1);

      const steps =
        typeof value === 'string'
          ? await this.evaluateProperties(value, state, false)
          : value;
      const baseStepNumber = getCurrentStepNumber(state.variables);
      const results = await stepsRunner.runTestSteps(
        (Array.isArray(steps) ? steps : [steps]) as TestSteps,
        state,
        (stepNumber) => `${baseStepNumber}-execute-${stepNumber}`,
      );

      newValue = Array.isArray(steps) || key[0] === '<' ? results : results[0];
    } else if (key.startsWith('!')) {
      newKey = key.substring(1);
      newValue = value;

      recursive = false;
    } else {
      if (key === 'steps') {
        newValue =
          typeof value === 'string'
            ? await this.evaluateProperties(value, state, false)
            : value;
      } else {
        newValue = await this.evaluateProperties(value, state, recursive);
      }

      return { key, value: newValue };
    }

    return await this.evaluateProperty(newValue, newKey, state, recursive);
  }
}
