import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetPageUrlAction}
 */
export class GetPageUrlActionProperties implements IActionProperties {}

/** Action type aliases for {@link GetPageUrlAction} */
export const GetPageUrlActionTypeAliases = [
  'get-page-url',
  'page-url',
] as const;

/**
 * Gets the URL of the current page
 * @properties {@link GetPageUrlActionProperties}
 * @runnerType {@link GetPageUrlActionTypeAliases}
 * @returns {string} URL of the current page
 */
@Action(
  GetPageUrlActionProperties,
  'Get page url',
  ...GetPageUrlActionTypeAliases,
)
export class GetPageUrlAction extends IAction<
  GetPageUrlActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetPageUrlActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetPageUrlAction>(GetPageUrlAction);
  }

  public async run(state: IState): Promise<string> {
    const url = await state.currentDriver.getCurrentUrl();

    this.logger.info(`Successfully got URL '${url}' of the page`);

    return url;
  }
}
