import { injectable, inject } from 'tsyringe';

import { State } from "../../../models/actions/testRunState";
import { IPropertiesEvaluator, PropertiesEvaluatorInjectionToken } from "../iPropertiesEvaluator";
import { IPropertyEvaluator, KeyValue } from "../iPropertyEvaluator";

/**
 * Default implementation of the property evaluator. Runs evaluation of the object
 */
@injectable()
export class DefaultPropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 1;
    }

    public async evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        property.value = await this.propertiesEvaluator.evaluateProperties(property.value, state, recursive);
        
        await super.next(property, state, recursive);
    }
}