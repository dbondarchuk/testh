import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link DeleteAllCookiesAction}
 */
export class DeleteAllCookiesActionProperties implements IActionProperties {}

/** Action type aliases for {@link DeleteAllCookiesAction} */
export const DeleteAllCookiesActionTypeAliases = ['delete-cookies'] as const;

/**
 * Deletes all cookies visible to the current page
 * @properties {@link DeleteAllCookiesActionProperties}
 * @runnerType {@link DeleteAllCookiesActionTypeAliases}
 */
@Action(
  DeleteAllCookiesActionProperties,
  'Delete all cookies',
  ...DeleteAllCookiesActionTypeAliases,
)
export class DeleteAllCookiesAction extends IAction<DeleteAllCookiesActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: DeleteAllCookiesActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<DeleteAllCookiesAction>(
      DeleteAllCookiesAction,
    );
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.manage().deleteAllCookies();

    this.logger.info(`Successfully deleted all cookies`);
  }
}
