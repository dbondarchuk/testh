import {
  Action,
  BindingProperty,
  Condition,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  ToCondition,
} from '@testh/sdk';

/**
 * Properties for {@link NotConditionAction}
 */
export class NotConditionActionProperties implements IActionProperties {
  /**
   * Condition to wait for
   */
  @BindingProperty()
  @ToCondition()
  condition: Condition;
}

/** Action type aliases for {@link NotConditionActionType} */
export const NotConditionActionTypeAliases = ['not'] as const;

/**
 * Inverts the result of a condition
 * @parameters {@link NotConditionActionProperties}
 * @runnerType {@link NotConditionActionTypeAliases}
 * @returns {boolean} Whether the condition is false
 */
@Action(NotConditionActionProperties, 'Not', ...NotConditionActionTypeAliases)
export class NotConditionAction extends IAction<
  NotConditionActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: NotConditionActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<NotConditionAction>(NotConditionAction);
  }

  public async run(state: IState): Promise<boolean> {
    if (this.props.condition === undefined || this.props.condition === null) {
      throw new PropertyIsRequiredException('condition');
    }

    this.logger.debug(`Checking a condition.`);

    const result = await this.props.condition(state);
    this.logger.debug(`Condition result was ${result}. Returning ${!result}`);

    return !result;
  }
}
