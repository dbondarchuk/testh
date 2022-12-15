import { Action, IAction, IActionProperties, ILogger, ILoggerFactory, IState, PropertyIsRequiredException } from '@testh/sdk';

/**
 * Properties for {@link AddToArrayVariableAction}
 */
export class AddToArrayVariableActionProperties
  implements IActionProperties
{
  /**
   * Name of the array variable
   */
  variable: string;

  /**
   * Value to add
   */
  value: any;
}

/**
 * Runner type aliases for {@link AddToArrayVariableAction}
 */
export const AddToArrayVariableActionTypeAliases = [
  'add-to-array-variable',
] as const;

/**
 * Sets a value into a variable
 * @properties {@link AddToArrayVariableActionProperties}
 * @runnerType {@link AddToArrayVariableActionTypeAliases}
 */
@Action(
  AddToArrayVariableActionProperties,
  ...AddToArrayVariableActionTypeAliases,
)
export class AddToArrayVariableAction extends IAction<AddToArrayVariableActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: AddToArrayVariableActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AddToArrayVariableAction>(
      AddToArrayVariableAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    const array = state.variables.get(variable) as Array<any>;
    array.push(this.props.value);

    this.logger.info(
      `Succesfully added a new value into ${variable} array variable`,
    );
  }
}
