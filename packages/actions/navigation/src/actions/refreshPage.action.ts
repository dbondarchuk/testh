import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link RefreshPageAction}
 */
export class RefreshPageActionProperties implements IActionProperties {}

/** Action type aliases for {@link RefreshPageAction} */
export const RefreshPageActionTypeAliases = [
  'refresh',
  'refresh-page',
] as const;

/**
 * Refreshes the current page
 * @properties {@link RefreshPageActionProperties}
 * @runnerType {@link RefreshPageActionTypeAliases}
 */
@Action(
  RefreshPageActionProperties,
  'Refresh page',
  ...RefreshPageActionTypeAliases,
)
export class RefreshPageAction extends IAction<RefreshPageActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: RefreshPageActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RefreshPageAction>(RefreshPageAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.navigate().refresh();

    this.logger.info(`Successfully refreshed page`);
  }
}
