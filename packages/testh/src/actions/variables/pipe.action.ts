import {
  Action,
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
 * Properties for {@link PipeAction}
 */
export class PipeActionProperties implements IActionProperties {
  /**
   * Name of the variable where to store value
   */
  variable: string;

  /**
   * Value to set
   */
  value: any;

  /** Steps to run */
  @ToTestStepsAction()
  steps: TestStepsAction;
}

/** Action type aliases for {@link PipeAction} */
export const PipeActionTypeAliases = ['pipe'] as const;

/**
 * Sets a value into a variable and pipes it down to the steps
 * @properties {@link PipeActionProperties}
 * @runnerType {@link PipeActionTypeAliases}
 * @result `Array<any>` Array of last step results for each item
 */
@Action(PipeActionProperties, 'Pipe', ...PipeActionTypeAliases)
export class PipeAction extends IAction<PipeActionProperties, any[]> {
  private readonly logger: ILogger;
  constructor(props: PipeActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<PipeAction>(PipeAction);
  }

  public async run(state: IState): Promise<any[]> {
    let variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    variable = state.variables.put(variable, this.props.value);

    const result = await this.props.steps.execute(state);

    this.logger.info(
      `Succesfully piped down '${variable}' to ${this.props.steps.length} steps`,
    );
    return result;
  }
}
