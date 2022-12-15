import { IPropertiesEvaluator, IPropertyEvaluator, IState, KeyValue, PropertyEvaluatorInjectionToken, WrapperWithVariables } from '@testh/sdk';
import { singleton, container } from 'tsyringe';


const isPlainObject = (value: any): boolean => value?.constructor === Object;

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
                    if (isPlainObject(obj)) {
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
    ): Promise<KeyValue> {
        const result: KeyValue = {
            key,
            value
        };

        const implementations = container
            .resolveAll<IPropertyEvaluator>(PropertyEvaluatorInjectionToken)
            .sort((a, b) => b.priority - a.priority);

        const evaluator = implementations[0];
        let current = evaluator;
        current.setFirst(evaluator);
        for (let i = 1; i < implementations.length; i++) {
            current.setNext(implementations[i]);
            current.setFirst(evaluator);
            current = implementations[i];
        }

        await evaluator.evaluate(result, state, recursive);

        return result;
    }
}
