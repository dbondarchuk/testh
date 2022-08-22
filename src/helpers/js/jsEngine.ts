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
    ): any {
        return function evaluateEval() {
            const argsStr = Object.keys(context)
                .map((key) => `${key} = this.${key}`)
                .join(',');
            const argsDef = argsStr ? `let ${argsStr};` : '';

            return eval(`${argsDef}${code}`);
        }.call(context);
    }

    /**
     * Replaces variables in the expression
     * @param value Value string
     * @param variables Variables to load
     * @returns Evaluated string
     */
    public static replaceVariables(
        value: string,
        variables: Variables,
    ): string | any | undefined {
        if (!value) return undefined;

        const pattern = /\$\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;

        let replacedValue;
        let wasReplaced = false;

        const replaced = value.replaceAll(pattern, (match, group) => {
            let result = this.evaluate(
                group.toString().replaceAll('\\$', '\\\\\\$'),
                variables?.variables,
            );

            result = JsEngine.evaluateProperties(result, variables);

            if (match === value) {
                replacedValue = result;
                wasReplaced = true;
            }

            return result;
        });

        return wasReplaced ? replacedValue : replaced;
    }

    public static evaluateProperties = (
        obj: any,
        variables: Variables,
    ): any => {
        let newValue: any;

        switch (typeof obj) {
            case 'string':
                newValue = JsEngine.replaceVariables(obj, variables);
                break;

            case 'object':
                if (Array.isArray(obj)) {
                    newValue = [];
                    for (const item of obj as any[]) {
                        newValue.push(
                            JsEngine.evaluateProperties(item, variables),
                        );
                    }
                } else {
                    newValue = {};
                    for (const key in obj) {
                        newValue[key] = JsEngine.evaluateProperties(
                            obj[key],
                            variables,
                        );
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
