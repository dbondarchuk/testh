import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
} from '@testh/sdk';

/**
 * Properties for {@link GetCookieAction}
 */
export class GetCookieActionProperties implements IActionProperties {
  /** Name of the cookie */
  @BindingProperty()
  name: string;
}

/** Action type aliases for {@link GetCookieAction} */
export const GetCookieActionTypeAliases = ['cookie', 'get-cookie'] as const;

/**
 * Gets a cookies visible to the current page by its name
 * @properties {@link GetCookieActionProperties}
 * @runnerType {@link GetCookieActionTypeAliases}
 * @result `string` Cookie's value
 */
@Action(
  GetCookieActionProperties,
  'Get a cookie',
  ...GetCookieActionTypeAliases,
)
export class GetCookieAction extends IAction<
  GetCookieActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(props: GetCookieActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GetCookieAction>(GetCookieAction);
  }

  public async run(state: IState): Promise<string> {
    if (!this.props.name) {
      throw new PropertyIsRequiredException('name');
    }

    const cookie = await state.currentDriver
      .manage()
      .getCookie(this.props.name);

    this.logger.info(
      `Successfully got a cookie with the name '${this.props.name}': '${cookie.value}'`,
    );

    return cookie.value;
  }
}
