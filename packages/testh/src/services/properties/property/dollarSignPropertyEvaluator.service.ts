import { inject } from 'tsyringe';
import {
  Constructor,
  IPropertiesEvaluator,
  IPropertyEvaluator,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  PropertyEvaluatorInjectionToken,
  Service,
  Variables,
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

  /** @inheritdoc */
  public parseKey(key: string): string {
    return key.startsWith('$')
      ? super.firstParseKey(key.substring(1))
      : super.nextParseKey(key);
  }

  public async evaluate(
    property: KeyValue,
    variables: Variables,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void> {
    if (!property.key.startsWith('$') || typeof property.value !== 'string') {
      await super.next(property, variables, recursive, type);
      return;
    }

    property.key = property.key.substring(1);
    property.value = await this.propertiesEvaluator.evaluate(
      property.value,
      variables,
    );

    await super.first(property, variables, recursive, type);
  }
}
