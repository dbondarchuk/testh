import { injectable, inject } from 'tsyringe';

import { State } from "../../../models/actions/testRunState";
import { IPropertiesEvaluator, PropertiesEvaluatorInjectionToken } from "../iPropertiesEvaluator";
import { IPropertyEvaluator, KeyValue } from "../iPropertyEvaluator";

/**
 * Runs specified steps when property key is 'steps'
 */
@injectable()
export class StepsPropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 5;
    }

    public async evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (property.key === 'steps') {
            property.value = typeof property.value === 'string'
                ? await this.propertiesEvaluator.evaluateProperties(property.value, state, false)
                : property.value;
        } else {
            await super.next(property, state, recursive);
        }
    }

}