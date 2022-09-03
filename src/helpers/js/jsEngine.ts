import { VariablesContainer } from '../../models/variables/variablesContainer';
import { isEvaluateOnlyIfStringProperty } from './models/evaluateOnlyIfString';
import { WrapperWithVariables } from './models/valueWithBaseVariables';

/**
 * Helper to run JS code
 */
export class JsEngine {
  /**
   * Runs JS code with the context
   * @param code JS code
   * @param context Context
   * @returns Result of JS code evaluation
   */
  public static evaluate(
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

  /**
   * Replaces variables in the expression
   * @param value Value string
   * @param variables Variables to load
   * @returns Evaluated string
   */
  public static async replaceVariables(
    value: string,
    variables: VariablesContainer,
    recursive = true
  ): Promise<string | any | undefined> {
    if (!value) return undefined;

    const pattern = /\$\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;

    let replacedValue;
    let wasReplaced = false;

    const replaced = await JsEngine.replaceAllAsync(
      value,
      pattern,
      async (match, group) => {
        let result = await this.evaluate(
          group.toString().replaceAll('\\$', '\\\\\\$'),
          variables?.variables,
        );

        if (recursive) {
          result = await JsEngine.evaluateProperties(result, variables);
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

  public static evaluateProperties = async (
    obj: any,
    variables: VariablesContainer,
    recursive = true
  ): Promise<any> => {
    let newValue: any;

    switch (typeof obj) {
      case 'string':
        newValue = await JsEngine.replaceVariables(obj, variables, recursive);
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
            newValue.variables = variables
          }

          const isObjEvaluateOnlyIfString = isEvaluateOnlyIfStringProperty(obj);
          for (const item of obj as any[]) {
            if (isObjEvaluateOnlyIfString || isEvaluateOnlyIfStringProperty(item)) {
              newValue.push(typeof item === 'string'
                ? await JsEngine.evaluateProperties(item, variables, false)
                : item);
            } else {
              newValue.push(await JsEngine.evaluateProperties(item, variables, recursive));
            }
          }
        } else {
          newValue = {};
          for (const key in obj) {
            if (key === 'steps') {
              newValue[key] = typeof obj[key] === 'string'
                ? await JsEngine.evaluateProperties(obj[key], variables, false)
                : obj[key];
            } else {
              newValue[key] = await JsEngine.evaluateProperties(obj[key], variables, recursive);
            }
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

    // const values: Record<string, any> = {};
    // for (const key in obj) {
    //     const newKey = JsEngine.replaceVariables(key, variables);

    //     const value = obj[key];
    //     let newValue: any = value;

    //     switch (typeof value) {
    //         case 'string':
    //             newValue = JsEngine.replaceVariables(value, variables);
    //             break;

    //         case 'object':
    //             if (Array.isArray(value)) {
    //                 newValue = [];
    //                 for (const item of value as any[]) {
    //                     newValue.push(evaluateProperties(item, variables));
    //                 }
    //             } else {
    //                 newValue = evaluateProperties(value, variables);
    //             }

    //             break;

    //         case 'number':
    //         case 'boolean':
    //         default:
    //             newValue = value;
    //             break;
    //     }

    //     values[newKey] = newValue;
    // }

    // return values;
  };
}
