import { injectable, inject } from 'tsyringe';

import { State } from "../../../models/actions/testRunState";
import { IPropertiesEvaluator, PropertiesEvaluatorInjectionToken } from "../iPropertiesEvaluator";
import { IPropertyEvaluator, KeyValue } from "../iPropertyEvaluator";

@injectable()
export class DollarSignPropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 9;
    }

    public async evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (property.key.startsWith('$') && typeof property.value === 'string') {
            property.key = property.key.substring(1);
            property.value = await this.propertiesEvaluator.evaluate(property.value, state.variables.variables);

            await super.first(property, state, recursive);
        } else {        
            await super.next(property, state, recursive);
        }
    }

}