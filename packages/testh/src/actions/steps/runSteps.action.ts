import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  TestStep,
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

/**
 * Action type alias for {@link RunStepsAction}.
 * Will indicate for action to return only the last step result instead of all
 */
export const RunStepsSingleResultActionTypeAlias = 'run-steps-single-result';

/** Action type aliases for {@link RunStepsAction} */
export const RunStepsActionTypeAliases = [
  'run',
  'run-steps',
  RunStepsSingleResultActionTypeAlias,
] as const;

/**
 * Runs specified test steps
 * @properties {@link RunStepsActionProperties}
 * @runnerType {@link RunStepsActionTypeAliases}
 * @result `Array<any>` Array of each step execution result
 * @result `any` Last step execution result when {@link RunStepsSingleResultActionTypeAlias} was used as type
 */
@Action(RunStepsActionProperties, 'Run steps', ...RunStepsActionTypeAliases)
export class RunStepsAction extends IAction<
  RunStepsActionProperties,
  any | any[]
> {
  private readonly logger: ILogger;
  constructor(props: RunStepsActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<RunStepsAction>(RunStepsAction);
  }

  public async run(state: IState, step: TestStep): Promise<any | any[]> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    this.logger.info(`Running ${this.props.steps.length} steps`);

    const result = await this.props.steps.execute(state);

    this.logger.info(`Successfully run all steps for all items`);

    return step.type === RunStepsSingleResultActionTypeAlias
      ? result[result.length - 1]
      : result;
  }
}
