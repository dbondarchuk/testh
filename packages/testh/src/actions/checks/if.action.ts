import {
  Action,
  Condition,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  IStepsRunner,
  PropertyIsRequiredException,
  resolve,
  StepsRunnerInjectionToken,
  TestSteps,
  ToCondition,
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
  then: TestSteps;

  /** Steps to do when condition is false */
  else?: TestSteps;
}

/** Action type aliases for {@link IfAction} */
export const IfActionTypeAliases = ['if'] as const;

/**
 * Checks if a condition returns true, then executes a code
 * @parameters {@link IfActionProperties}
 * @runnerType {@link IfActionTypeAliases}
 */
@Action(IfActionProperties, 'If', ...IfActionTypeAliases)
export class IfAction extends IAction<IfActionProperties> {
  private readonly logger: ILogger;
  private readonly stepsRunner: IStepsRunner;
  constructor(props: IfActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<IfAction>(IfAction);
    this.stepsRunner = resolve<IStepsRunner>(StepsRunnerInjectionToken);
  }

  public async run(state: IState): Promise<void> {
    if (this.props.condition === undefined || this.props.condition === null) {
      throw new PropertyIsRequiredException('condition');
    }

    if (!this.props.then) {
      throw new PropertyIsRequiredException('then');
    }

    this.logger.info(`Checking a condition.`);

    const result = await this.props.condition(state);
    const currentStepNumber = getCurrentStepNumber(state.variables);
    if (result) {
      this.logger.info(
        'Condition was resolved succesfuly. Executing "then" block',
      );
      this.stepsRunner.runTestSteps(
        this.props.then,
        state,
        (num) => currentStepNumber + '-then-' + num,
      );
    } else {
      this.logger.info(
        `Condition was not resolved succesfuly.${
          this.props.else ? ' Executing "then" block' : ''
        }`,
      );
      if (this.props.else) {
        this.stepsRunner.runTestSteps(
          this.props.else,
          state,
          (num) => currentStepNumber + '-else-' + num,
        );
      }
    }
  }
}
