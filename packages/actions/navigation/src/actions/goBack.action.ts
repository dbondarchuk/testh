import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GoBackAction}
 */
export class GoBackActionProperties implements IActionProperties {}

/** Action type aliases for {@link GoBackAction} */
export const GoBackActionTypeAliases = ['go-back', 'back'] as const;

/**
 * Navigates back in history
 * @properties {@link GoBackActionProperties}
 * @runnerType {@link GoBackActionTypeAliases}
 */
@Action(GoBackActionProperties, 'Go back', ...GoBackActionTypeAliases)
export class GoBackAction extends IAction<GoBackActionProperties> {
  private readonly logger: ILogger;
  constructor(props: GoBackActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GoBackAction>(GoBackAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.navigate().back();

    this.logger.info(`Successfully went back in history`);
  }
}
