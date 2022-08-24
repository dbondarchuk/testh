import { Variables } from '../../models/tests/variables';

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
    variables: Variables,
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

        result = await JsEngine.evaluateProperties(result, variables);

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
    variables: Variables,
  ): Promise<any> => {
    let newValue: any;

    switch (typeof obj) {
      case 'string':
        newValue = await JsEngine.replaceVariables(obj, variables);
        break;

      case 'object':
        if (Array.isArray(obj)) {
          newValue = [];
          for (const item of obj as any[]) {
            newValue.push(await JsEngine.evaluateProperties(item, variables));
          }
        } else {
          newValue = {};
          for (const key in obj) {
            newValue[key] =
              key !== 'steps'
                ? await JsEngine.evaluateProperties(obj[key], variables)
                : obj[key];
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
