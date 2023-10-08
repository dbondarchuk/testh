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
 * Properties for {@link CheckConditionAction}
 */
export class CheckConditionActionProperties implements IActionProperties {
  /**
   * Condition to check
   */
  @BindingProperty()
  @ToCondition()
  condition: Condition;
}

/** Action type aliases for {@link CheckConditionAction} */
export const CheckConditionActionTypeAliases = ['check'] as const;

/**
 * Checks if a condition returns true
 * @parameters {@link CheckConditionActionProperties}
 * @runnerType {@link CheckConditionActionTypeAliases}
 */
@Action(
  CheckConditionActionProperties,
  'Check condition',
  ...CheckConditionActionTypeAliases,
)
export class CheckConditionAction extends IAction<CheckConditionActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CheckConditionActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CheckConditionAction>(CheckConditionAction);
  }

  public async run(state: IState): Promise<void> {
    if (this.props.condition === undefined || this.props.condition === null) {
      throw new PropertyIsRequiredException('condition');
    }

    this.logger.info(`Checking a condition.`);

    const result = await this.props.condition(state);
    if (result) {
      this.logger.info('Condition was resolved succesfuly');
      return;
    }

    throw new Error('Condition has failed.');
  }
}
