import {
  Action,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  IState,
  PropertyIsRequiredException,
  TestStepsAction,
  ToTestStepsAction,
  updateStepNumber,
} from '@testh/sdk';

export class ForEachObjectPropertyActionProperties
  implements IActionProperties
{
  /** Object for which to iterate over properties */
  object: Record<string, any>;

  /** Steps to run */
  @ToTestStepsAction()
  steps: TestStepsAction;
}

/** Name of the variable where each property's name of {@link ForEachObjectPropertyActionProperties.object} is stored */
export const NAME_VARIABLE = 'NAME';

/** Name of the variable where each property's value of {@link ForEachObjectPropertyActionProperties.object} is stored */
export const VALUE_VARIABLE = 'VALUE';

/** Name of the variable where indexes for the items of {@link ForEachObjectPropertyActionProperties.object} is stored */
export const INDEX_VARIABLE = 'INDEX';

/** Action type aliases for {@link ForEachObjectPropertyAction} */
export const ForEachObjectPropertyActionTypeAliases = [
  'for-each-property',
  'for-each-object-property',
] as const;

/**
 * Runs specified test steps for each of the property in the object.
 * @properties {@link ForEachObjectPropertyActionProperties}
 * @runnerType {@link ForEachObjectPropertyActionTypeAliases}
 * @variable {@link NAME_VARIABLE} Name of the property
 * @variable {@link VALUE_VARIABLE} Value of the property
 * @variable {@link INDEX_VARIABLE} Property zero-based index
 */
@Action(
  ForEachObjectPropertyActionProperties,
  "Do for each object's property",
  ...ForEachObjectPropertyActionTypeAliases,
)
export class ForEachObjectPropertyAction extends IAction<ForEachObjectPropertyActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachObjectPropertyActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachObjectPropertyAction>(
      ForEachObjectPropertyAction,
    );
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    if (typeof this.props.object !== 'object') {
      throw new InvalidOperationException(`Property is not an object`);
    }

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${
        Object.keys(this.props.object).length
      } properties`,
    );

    const basicStepNumber = getCurrentStepNumber(state.variables);

    let index = 0;
    for (const name of Object.keys(this.props.object)) {
      state.variables.put(NAME_VARIABLE, name);
      state.variables.put(VALUE_VARIABLE, this.props.object[name]);

      state.variables.put(INDEX_VARIABLE, index);

      updateStepNumber(state.variables, `${basicStepNumber}.${index}`);

      await this.props.steps.execute(state);

      index++;
    }

    this.logger.info(`Succesfully run all steps for all properties`);
  }
}
