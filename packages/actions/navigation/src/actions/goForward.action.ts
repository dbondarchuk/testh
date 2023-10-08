import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GoForwardAction}
 */
export class GoForwardActionProperties implements IActionProperties {}

/** Action type aliases for {@link GoForwardAction} */
export const GoForwardActionTypeAliases = ['go-forward', 'forward'] as const;

/**
 * Navigates forward in history
 * @properties {@link GoForwardActionProperties}
 * @runnerType {@link GoForwardActionTypeAliases}
 */
@Action(GoForwardActionProperties, 'Go back', ...GoForwardActionTypeAliases)
export class GoForwardAction extends IAction<GoForwardActionProperties> {
  private readonly logger: ILogger;
  constructor(props: GoForwardActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GoForwardAction>(GoForwardAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.navigate().forward();

    this.logger.info(`Successfully went forward in history`);
  }
}
