import { injectable, inject } from 'tsyringe';

import { State } from "../../../models/actions/testRunState";
import { IPropertiesEvaluator, PropertiesEvaluatorInjectionToken } from "../iPropertiesEvaluator";
import { IPropertyEvaluator, KeyValue } from "../iPropertyEvaluator";

/**
 * Doesn't evaluate a property if the key starts with tilda sign (~)
 */
@injectable()
export class DoNotEvaluatePropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 2;
    }

    public async evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (!property.key.startsWith('~')) {
            await super.next(property, state, recursive);
        }
    }
}