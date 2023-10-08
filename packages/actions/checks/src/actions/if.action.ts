import {
  Action,
  Condition,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  TestStepsAction,
  ToCondition,
  ToTestStepsAction,
} from '@testh/sdk';

/**
 * Properties for {@link IfAction}
 */
export class IfActionProperties implements IActionProperties {
  /**
   * Condition to check
   */
  @ToCondition()
  condition: Condition;

  /** Steps to do when condition is true */
  @ToTestStepsAction()
  then: TestStepsAction;

  /** Steps to do when condition is false */
  @ToTestStepsAction()
  else?: TestStepsAction;
}

/** Action type aliases for {@link IfAction} */
export const IfActionTypeAliases = ['if'] as const;

/**
 * Checks if a condition returns true, then executes a code
 * @parameters {@link IfActionProperties}
 * @runnerType {@link IfActionTypeAliases}
 * @result `any[] | undefined` The result of executing `then` or `else` block. If the condition is `false` and the `else` block is not present it will return `undefined`
 */
@Action(IfActionProperties, 'If', ...IfActionTypeAliases)
export class IfAction extends IAction<IfActionProperties, any[] | undefined> {
  private readonly logger: ILogger;
  constructor(props: IfActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<IfAction>(IfAction);
  }

  public async run(state: IState): Promise<any[] | undefined> {
    if (this.props.condition === undefined || this.props.condition === null) {
      throw new PropertyIsRequiredException('condition');
    }

    if (!this.props.then) {
      throw new PropertyIsRequiredException('then');
    }

    this.logger.info(`Checking a condition.`);

    const result = await this.props.condition(state);
    let results: any[] | undefined = undefined;

    if (result) {
      this.logger.info(
        `Condition was resolved succesfuly. Executing "then" block with ${this.props.then.length} step(s)`,
      );

      results = await this.props.then.execute(state);
    } else {
      this.logger.info(
        `Condition was not resolved succesfuly.${
          this.props.else
            ? ` Executing "else" block with ${this.props.else.length} step(s)`
            : ''
        }`,
      );

      if (this.props.else) {
        results = await this.props.else.execute(state);
      }
    }

    return results;
  }
}
