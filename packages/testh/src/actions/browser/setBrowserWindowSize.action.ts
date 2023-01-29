import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  ToNumber,
} from '@testh/sdk';

/**
 * Properties for {@link SetBrowserWindowSizeAction}
 */
export class SetBrowserWindowSizeActionProperties implements IActionProperties {
  /**
   * New window width
   */
  @ToNumber()
  width: number;

  /**
   * New window height
   */
  @ToNumber()
  height: number;
}

/** Action type aliases for {@link SetBrowserWindowSizeAction} */
export const SetBrowserWindowSizeActionTypeAliases = ['set-size'] as const;

/**
 * Resizes current browser window
 * @properties {@link SetBrowserWindowSizeActionProperties}
 * @runnerType {@link SetBrowserWindowSizeActionTypeAliases}
 */
@Action(
  SetBrowserWindowSizeActionProperties,
  'Resize browser window',
  ...SetBrowserWindowSizeActionTypeAliases,
)
export class SetBrowserWindowSizeAction extends IAction<SetBrowserWindowSizeActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SetBrowserWindowSizeActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SetBrowserWindowSizeAction>(SetBrowserWindowSizeAction);
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.width) {
      throw new PropertyIsRequiredException('width');
    }
    
    if (!this.props.height) {
      throw new PropertyIsRequiredException('height');
    }

    await state.currentDriver.manage().window().setSize(this.props.width, this.props.height);

    this.logger.info(`Successfully resized browser window to ${this.props.width}x${this.props.height}`);
  }
}
