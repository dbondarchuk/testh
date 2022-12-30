import { IPropertiesEvaluator, IPropertyEvaluator, IState, KeyValue, PropertiesEvaluatorContainerToken } from '@testh/sdk';
import { injectable, inject } from 'tsyringe';

/**
 * Default implementation of the property evaluator. Runs evaluation of the object
 */
@injectable()
export class DefaultPropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorContainerToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 1;
    }

    public async evaluate(property: KeyValue, state: IState, recursive: boolean): Promise<void> {
        property.value = await this.propertiesEvaluator.evaluateProperties(property.value, state, recursive);
        
        await super.next(property, state, recursive);
    }
}