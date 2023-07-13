import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetCurrentWindowHandleAction}
 */
export class GetCurrentWindowHandleActionProperties
  implements IActionProperties {}

/** Action type aliases for {@link GetCurrentWindowHandleAction} */
export const GetCurrentWindowHandleActionTypeAliases = [
  'get-hanlde',
  'handle',
] as const;

/**
 * Gets handle of the current window (tab) (i.e. title of the page showed in the tab)
 * @properties {@link GetCurrentWindowHandleActionProperties}
 * @runnerType {@link GetCurrentWindowHandleActionTypeAliases}
 * @returns {string} Window handle of the current window (tab)
 */
@Action(
  GetCurrentWindowHandleActionProperties,
  'Get window handle',
  ...GetCurrentWindowHandleActionTypeAliases,
)
export class GetCurrentWindowHandleAction extends IAction<
  GetCurrentWindowHandleActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetCurrentWindowHandleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetCurrentWindowHandleAction>(
      GetCurrentWindowHandleAction,
    );
  }

  public async run(state: IState): Promise<string> {
    const handle = await state.currentDriver.getWindowHandle();

    this.logger.info(`Successfully got window handle: '${handle}'`);

    return handle;
  }
}
