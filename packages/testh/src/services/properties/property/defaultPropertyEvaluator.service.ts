import {
  IPropertiesEvaluator,
  IPropertyEvaluator,
  IState,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  PropertyEvaluatorInjectionToken,
  Service,
} from '@testh/sdk';
import { inject } from 'tsyringe';

/**
 * Default implementation of the property evaluator. Runs evaluation of the object
 */
@Service(PropertyEvaluatorInjectionToken)
export class DefaultPropertyEvaluator extends IPropertyEvaluator {
  public constructor(
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
  ) {
    super();
  }

  public get priority(): number {
    return 1;
  }

  public async evaluate(
    property: KeyValue,
    state: IState,
    recursive: boolean,
  ): Promise<void> {
    property.value = await this.propertiesEvaluator.evaluateProperties(
      property.value,
      state,
      recursive,
    );

    await super.next(property, state, recursive);
  }
}
