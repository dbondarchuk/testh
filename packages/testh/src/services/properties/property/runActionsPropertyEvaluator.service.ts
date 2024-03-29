import { inject } from 'tsyringe';
import {
  Constructor,
  getCurrentStepNumber,
  IPropertiesEvaluator,
  IPropertyEvaluator,
  IState,
  IStepsRunner,
  KeyValue,
  PropertiesEvaluatorInjectionToken,
  PropertyEvaluatorInjectionToken,
  Service,
  StateInstanceInjectionToken,
  StepsRunnerInjectionToken,
  TestSteps,
  updateStepNumber,
  Variables,
} from '@testh/sdk';

/**
 * Treats property value as steps to execute and get value.
 * Property key should be wrapped in parenthesis, i.e. `(property)`
 * If value is an array then result will be an array.
 * If value is single step, result will be a single item.
 */
@Service(PropertyEvaluatorInjectionToken)
export class RunActionsPropertyEvaluator extends IPropertyEvaluator {
  public constructor(
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
    @inject(StepsRunnerInjectionToken)
    protected readonly stepsRunner: IStepsRunner,
    @inject(StateInstanceInjectionToken)
    protected readonly state: IState,
  ) {
    super();
  }

  public get priority(): number {
    return 3;
  }

  /** @inheritdoc */
  public parseKey(key: string): string {
    return key.startsWith('(') && key.endsWith(')')
      ? key.substring(1, key.length - 1)
      : super.nextParseKey(key);
  }

  public async evaluate(
    property: KeyValue,
    variables: Variables,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void> {
    if (!property.key.startsWith('(') || !property.key.endsWith(')')) {
      await super.next(property, variables, recursive, type);
      return;
    }

    property.key = property.key.substring(1, property.key.length - 1);

    const steps =
      typeof property.value === 'string'
        ? await this.propertiesEvaluator.evaluateProperties(
            property.value,
            variables,
            undefined,
            false,
          )
        : property.value;

    const baseStepNumber = getCurrentStepNumber(this.state.variables);
    const results = await this.stepsRunner.runTestSteps(
      (Array.isArray(steps) ? steps : [steps]) as TestSteps,
      this.state,
      (stepNumber) => `${baseStepNumber}.${stepNumber}`,
    );

    updateStepNumber(this.state.variables, baseStepNumber);

    property.value = Array.isArray(steps)
      ? results
      : results[results.length - 1];

    await super.first(property, variables, recursive, type);
  }
}
