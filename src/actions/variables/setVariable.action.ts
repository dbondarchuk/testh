import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Action } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

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

  public async run(state: State): Promise<void> {
    let variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    variable = state.variables.put(variable, this.props.value);
    this.logger.info(`Succesfully stored value into ${variable} variable`);
  }
}
