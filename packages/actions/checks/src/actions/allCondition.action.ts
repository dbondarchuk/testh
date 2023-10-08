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
 * Properties for {@link AllConditionAction}
 */
export class AllConditionActionProperties implements IActionProperties {
  /**
   * Condition to wait for
   */
  @BindingProperty()
  @ToCondition()
  conditions: Condition[];
}

/** Action type aliases for {@link AllConditionAction} */
export const AllConditionActionTypeAliases = ['all'] as const;

/**
 * Checks if all conditions are true
 * @parameters {@link AllConditionActionProperties}
 * @runnerType {@link AllConditionActionTypeAliases}
 * @result `boolean` Whether all conditions are true
 */
@Action(AllConditionActionProperties, 'All', ...AllConditionActionTypeAliases)
export class AllConditionAction extends IAction<
  AllConditionActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: AllConditionActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AllConditionAction>(AllConditionAction);
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

      if (!result) {
        this.logger.info(
          `Condition # ${index} result was false. Result is false`,
        );

        return false;
      }

      updateStepNumber(state.variables, baseStepNumber);
      index++;
    }

    this.logger.info(`All conditions was successful. Result is true`);
    return true;
  }
}
