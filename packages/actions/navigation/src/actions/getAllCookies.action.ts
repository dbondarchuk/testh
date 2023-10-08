import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetAllCookiesAction}
 */
export class GetAllCookiesActionProperties implements IActionProperties {}

/** Action type aliases for {@link GetAllCookiesAction} */
export const GetAllCookiesActionTypeAliases = [
  'cookies',
  'get-cookies',
  'get-all-cookies',
] as const;

/**
 * Gets all cookies visible to the current page as map of names and values
 * @properties {@link GetAllCookiesActionProperties}
 * @runnerType {@link GetAllCookiesActionTypeAliases}
 * @result `Record<string, string>` All cookies visible to the current page as map of names and values
 */
@Action(
  GetAllCookiesActionProperties,
  'Get all cookies',
  ...GetAllCookiesActionTypeAliases,
)
export class GetAllCookiesAction extends IAction<
  GetAllCookiesActionProperties,
  Record<string, string>
> {
  private readonly logger: ILogger;
  constructor(
    props: GetAllCookiesActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetAllCookiesAction>(GetAllCookiesAction);
  }

  public async run(state: IState): Promise<Record<string, string>> {
    const cookies = await state.currentDriver.manage().getCookies();

    this.logger.info(`Successfully got ${cookies} cookies`);
    const map = cookies.reduce((obj, cookie) => {
      obj[cookie.name] = cookie.value;
      return obj;
    }, {} as Record<string, string>);

    return map;
  }
}
