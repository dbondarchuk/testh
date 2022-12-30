import { injectable, inject } from 'tsyringe';
import { IPropertiesEvaluator, IPropertyEvaluator, IState, KeyValue, PropertiesEvaluatorContainerToken } from '@testh/sdk';


/**
 * Doesn't evaluate a property if the key starts with tilda sign (~)
 */
@injectable()
export class DoNotEvaluatePropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorContainerToken) protected readonly propertiesEvaluator: IPropertiesEvaluator
    ) {
        super();
    }

    public get priority(): number {
        return 2;
    }

    public async evaluate(property: KeyValue, state: IState, recursive: boolean): Promise<void> {
        if (!property.key.startsWith('~')) {
            await super.next(property, state, recursive);
        }
    }
}