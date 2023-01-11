import { inject } from 'tsyringe';
import {
  IPropertiesEvaluator,
  IPropertyEvaluator,
  IState,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  PropertyEvaluatorInjectionToken,
  Service,
} from '@testh/sdk';

/**
 * Treats all property as value to evaluate if it is a string and key starts with the dollar sign ($)
 */
@Service(PropertyEvaluatorInjectionToken)
export class DollarSignPropertyEvaluator extends IPropertyEvaluator {
  public constructor(
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
  ) {
    super();
  }

  public get priority(): number {
    return 9;
  }

  public async evaluate(
    property: KeyValue,
    state: IState,
    recursive: boolean,
  ): Promise<void> {
    if (property.key.startsWith('$') && typeof property.value === 'string') {
      property.key = property.key.substring(1);
      property.value = await this.propertiesEvaluator.evaluate(
        property.value,
        state.variables.variables,
      );

      await super.first(property, state, recursive);
    } else {
      await super.next(property, state, recursive);
    }
  }
}
