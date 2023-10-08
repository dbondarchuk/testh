import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link QuitBrowserAction}
 */
export class QuitBrowserActionProperties implements IActionProperties {}

/** Action type aliases for {@link QuitBrowserAction} */
export const QuitBrowserActionTypeAliases = ['quit'] as const;

/**
 * Closes current browser session and removes current driver
 * @properties {@link QuitBrowserActionProperties}
 * @runnerType {@link QuitBrowserActionTypeAliases}
 */
@Action(
  QuitBrowserActionProperties,
  'Quit browser',
  ...QuitBrowserActionTypeAliases,
)
export class QuitBrowserAction extends IAction<QuitBrowserActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: QuitBrowserActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<QuitBrowserAction>(QuitBrowserAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.quit();
    state.removeCurrentDriver();

    this.logger.info('Successfully closed current browser');
  }
}
