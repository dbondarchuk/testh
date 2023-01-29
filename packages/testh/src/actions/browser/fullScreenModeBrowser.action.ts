import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link FullScreenModeBrowserAction}
 */
export class FullScreenModeBrowserActionProperties implements IActionProperties {
}

/** Action type aliases for {@link FullScreenModeBrowserAction} */
export const FullScreenModeBrowserActionTypeAliases = ['fullscreen'] as const;

/**
 * Invokes the "full screen" operation on the current window
 * @properties {@link FullScreenModeBrowserActionProperties}
 * @runnerType {@link FullScreenModeBrowserActionTypeAliases}
 */
@Action(
  FullScreenModeBrowserActionProperties,
  'Open full screen mode',
  ...FullScreenModeBrowserActionTypeAliases,
)
export class FullScreenModeBrowserAction extends IAction<FullScreenModeBrowserActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: FullScreenModeBrowserActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<FullScreenModeBrowserAction>(FullScreenModeBrowserAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.manage().window().fullscreen();

    this.logger.info('Successfully invoked full screen mode for browser');
  }
}
