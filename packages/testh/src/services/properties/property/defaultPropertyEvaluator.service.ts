import {
  Constructor,
  hasNonRecursiveMetadata,
  hasSkipEvaluateMetadata,
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

  /** @inheritdoc */
  public parseKey(key: string): string {
    return super.nextParseKey(key);
  }

  public async evaluate(
    property: KeyValue,
    state: IState,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void> {
    const hasSkipMetadata = type && hasSkipEvaluateMetadata(property.key, type);
    if (!hasSkipMetadata) {
      const isRecursive =
        recursive && (!type || !hasNonRecursiveMetadata(property.key, type));

      property.value = await this.propertiesEvaluator.evaluateProperties(
        property.value,
        state,
        property.value?.constructor,
        isRecursive,
      );
    }

    await super.next(property, state, recursive, type);
  }
}
