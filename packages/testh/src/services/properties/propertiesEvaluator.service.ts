import {
  Constructor,
  getPropertyEvaluators,
  hasNonRecursiveMetadata,
  hasSkipEvaluateMetadata,
  IPropertiesEvaluator,
  IState,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  Service,
  WrapperWithVariables,
} from '@testh/sdk';

export const isPlainObject = (value: any): boolean =>
  value?.constructor === Object;

/** Default properties evaluator */
@Service(PropertiesEvaluatorInjectionToken)
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

  /** @inheritdoc */
  public evaluate(
    code: string,
    context: Record<string, any> = {},
  ): Promise<any> {
    return function evaluateEval(): any {
      const argsStr = Object.keys(context)
        .map((key) => `${key} = this.${key}`)
        .join(',');
      const argsDef = argsStr ? `let ${argsStr};` : '';

      const result = eval(`(async () => {${argsDef} return ${code}})`);
      return result();
    }.call(context);
  }

  /** @inheritdoc */
  public async replaceVariables(
    value: string,
    state: IState,
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

  /** @inheritdoc */
  public async evaluateProperties(
    obj: any,
    state: IState,
    type?: Constructor<any>,
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
              await this.evaluateProperties(item, state, type, recursive),
            );
          }
        } else {
          if (isPlainObject(obj)) {
            newValue = {};
            for (const key in obj) {
              const hasSkipMetadata =
                type && hasSkipEvaluateMetadata(key, type);
              if (hasSkipMetadata) {
                newValue[key] = obj[key];
                continue;
              }

              const isRecursive =
                recursive && (!type || !hasNonRecursiveMetadata(key, type));
              const evaluated = await this.evaluateProperty(
                obj[key],
                key,
                state,
                isRecursive,
                type,
              );

              newValue[evaluated.key] = evaluated.value;
            }
          } else {
            newValue = obj;
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
    state: IState,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<KeyValue> {
    const result: KeyValue = {
      key,
      value,
    };

    const evaluator = getPropertyEvaluators();

    await evaluator.evaluate(result, state, recursive, type);

    return result;
  }
}
