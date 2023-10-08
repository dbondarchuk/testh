import {
  Action,
  BindingProperty,
  Condition,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  ToCondition,
  updateStepNumber,
} from '@testh/sdk';

/**
 * Properties for {@link OrConditionAction}
 */
export class OrConditionActionProperties implements IActionProperties {
  /**
   * Condition to wait for
   */
  @BindingProperty()
  @ToCondition()
  conditions: Condition[];
}

/** Action type aliases for {@link OrConditionAction} */
export const OrConditionActionTypeAliases = ['or'] as const;

/**
 * Checks if at least one conditions is true
 * @parameters {@link OrConditionActionProperties}
 * @runnerType {@link OrConditionActionTypeAliases}
 * @result `boolean` Whether at least one condition is true
 */
@Action(OrConditionActionProperties, 'Or', ...OrConditionActionTypeAliases)
export class OrConditionAction extends IAction<
  OrConditionActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: OrConditionActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<OrConditionAction>(OrConditionAction);
  }

  public async run(state: IState): Promise<boolean> {
    if (!this.props.conditions) {
      throw new PropertyIsRequiredException('conditions');
    }

    this.logger.debug(`Checking a conditions.`);

    let index = 1;
    const baseStepNumber = getCurrentStepNumber(state.variables);
    for (const condition of this.props.conditions) {
      updateStepNumber(state.variables, `${baseStepNumber}-all-${index}`);
      const result = await condition(state);
      this.logger.debug(`Condition #${index} result was ${result}`);

      if (result) {
        this.logger.info(
          `Condition # ${index} result was true. Result is true`,
        );

        return true;
      }

      updateStepNumber(state.variables, baseStepNumber);
      index++;
    }

    this.logger.info(`All conditions weren't successful. Result is false`);
    return false;
  }
}
