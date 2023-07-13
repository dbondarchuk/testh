import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  TestStepsAction,
  ToTestStepsAction,
} from '@testh/sdk';

/**
 * Properties for {@link RunStepsAction}
 */
export class RunStepsActionProperties implements IActionProperties {
  /** Steps to run */
  @ToTestStepsAction()
  @BindingProperty()
  steps: TestStepsAction;
}

/** Action type aliases for {@link RunStepsAction} */
export const RunStepsActionTypeAliases = ['run', 'run-steps'] as const;

/**
 * Runs specified test steps
 * @properties {@link RunStepsActionProperties}
 * @runnerType {@link RunStepsActionTypeAliases}
 * @returns {Array<any>} Array of each step execution result
 */
@Action(RunStepsActionProperties, 'Run steps', ...RunStepsActionTypeAliases)
export class RunStepsAction extends IAction<RunStepsActionProperties, any[]> {
  private readonly logger: ILogger;
  constructor(props: RunStepsActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<RunStepsAction>(RunStepsAction);
  }

  public async run(state: IState): Promise<any[]> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    this.logger.info(`Running ${this.props.steps.length} steps`);

    const result = await this.props.steps.execute(state);

    this.logger.info(`Successfully run all steps for all items`);

    return result;
  }
}
