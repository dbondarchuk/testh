import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link MaximizeBrowserWindowAction}
 */
export class MaximizeBrowserWindowActionProperties
  implements IActionProperties {}

/** Action type aliases for {@link MaximizeBrowserWindowAction} */
export const MaximizeBrowserWindowActionTypeAliases = ['maximize'] as const;

/**
 * Maximizes current browser window
 * @properties {@link MaximizeBrowserWindowActionProperties}
 * @runnerType {@link MaximizeBrowserWindowActionTypeAliases}
 */
@Action(
  MaximizeBrowserWindowActionProperties,
  'Maximize browser window',
  ...MaximizeBrowserWindowActionTypeAliases,
)
export class MaximizeBrowserWindowAction extends IAction<MaximizeBrowserWindowActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: MaximizeBrowserWindowActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MaximizeBrowserWindowAction>(
      MaximizeBrowserWindowAction,
    );
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.manage().window().maximize();

    this.logger.info('Successfully maximized browser window');
  }
}
