import { inject } from 'tsyringe';
import {
  Constructor,
  IPropertiesEvaluator,
  IPropertyEvaluator,
  IState,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  PropertyEvaluatorInjectionToken,
  Service,
} from '@testh/sdk';

/**
 * Doesn't evaluate a property if the key starts with tilda sign (~)
 */
@Service(PropertyEvaluatorInjectionToken)
export class DoNotEvaluatePropertyEvaluator extends IPropertyEvaluator {
  public constructor(
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
  ) {
    super();
  }

  public get priority(): number {
    return 2;
  }

  /** @inheritdoc */
  public parseKey(key: string): string {
    return key.startsWith('~') ? key.substring(1) : super.nextParseKey(key);
  }

  public async evaluate(
    property: KeyValue,
    state: IState,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void> {
    if (!property.key.startsWith('~')) {
      await super.next(property, state, recursive, type);
    }
  }
}
