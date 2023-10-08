import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link CloseTabAction}
 */
export class CloseTabActionProperties implements IActionProperties {}

/** Action type aliases for {@link CloseTabAction} */
export const CloseTabActionTypeAliases = ['close-tab'] as const;

/**
 * Closes browser's current tab. If it was the last tab, then closes the browser
 * @properties {@link CloseTabActionProperties}
 * @runnerType {@link CloseTabActionTypeAliases}
 */
@Action(CloseTabActionProperties, 'Close tab', ...CloseTabActionTypeAliases)
export class CloseTabAction extends IAction<CloseTabActionProperties> {
  private readonly logger: ILogger;
  constructor(props: CloseTabActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<CloseTabAction>(CloseTabAction);
  }

  public async run(state: IState): Promise<void> {
    if ((await state.currentDriver.getAllWindowHandles()).length >= 1) {
      await state.currentDriver.close();
      this.logger.info('Successfully closed the tab');
    } else {
      await state.currentDriver.quit();
      state.removeCurrentDriver();

      this.logger.info('Successfully closed current browser');
    }
  }
}
