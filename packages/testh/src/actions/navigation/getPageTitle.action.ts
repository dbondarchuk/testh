import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetPageTitleAction}
 */
export class GetPageTitleActionProperties implements IActionProperties {}

/** Action type aliases for {@link GetPageTitleAction} */
export const GetPageTitleActionTypeAliases = [
  'get-page-title',
  'page-title',
] as const;

/**
 * Gets a title of the current page
 * @properties {@link GetPageTitleActionProperties}
 * @runnerType {@link GetPageTitleActionTypeAliases}
 * @result `string` Title of the current page
 */
@Action(
  GetPageTitleActionProperties,
  'Get page title',
  ...GetPageTitleActionTypeAliases,
)
export class GetPageTitleAction extends IAction<
  GetPageTitleActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetPageTitleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetPageTitleAction>(GetPageTitleAction);
  }

  public async run(state: IState): Promise<string> {
    const title = await state.currentDriver.getTitle();

    this.logger.info(`Successfully got title '${title}' of the page`);

    return title;
  }
}
