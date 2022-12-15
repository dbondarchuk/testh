import { Action, IAction, IActionProperties, ILogger, ILoggerFactory, IState, PropertyIsRequiredException } from '@testh/sdk';


/**
 * Properties for {@link SetVariableAction}
 */
export class SetVariableActionProperties
  implements IActionProperties
{
  /**
   * Name of the variable where to store value
   */
  variable: string;

  /**
   * Value to set
   */
  value: any;
}

/** Runner type aliases for {@link SetVariableAction} */
export const SetVariableActionTypeAliases = ['set-variable'] as const;

/**
 * Sets a value into a variable
 * @properties {@link SetVariableActionProperties}
 * @runnerType {@link SetVariableActionTypeAliases}
 */
@Action(
  SetVariableActionProperties,
  ...SetVariableActionTypeAliases,
)
export class SetVariableAction extends IAction<SetVariableActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SetVariableActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SetVariableAction>(
      SetVariableAction,
    );
  }

  public async run(state: IState): Promise<void> {
    let variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    variable = state.variables.put(variable, this.props.value);
    this.logger.info(`Succesfully stored value into ${variable} variable`);
  }
}
