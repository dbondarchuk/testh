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
 * Properties for {@link SwitchToWindowByHandleAction}
 */
export class SwitchToWindowByHandleActionProperties implements IActionProperties {
  /**
   * Handle of the window to switch to
   */
  @BindingProperty()
  handle: string;
}

/** Action type aliases for {@link SwitchToWindowByHandleAction} */
export const SwitchToWindowByHandleActionTypeAliases = ['switch'] as const;

/**
 * Switches to another window (tab) using window hanlde
 * @properties {@link SwitchToWindowByHandleActionProperties}
 * @runnerType {@link SwitchToWindowByHandleActionTypeAliases}
 */
@Action(
  SwitchToWindowByHandleActionProperties,
  'Switch to window by handle',
  ...SwitchToWindowByHandleActionTypeAliases,
)
export class SwitchToWindowByHandleAction extends IAction<SwitchToWindowByHandleActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToWindowByHandleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToWindowByHandleAction>(SwitchToWindowByHandleAction);
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.handle) {
      throw new PropertyIsRequiredException('handle');
    }

    await state.currentDriver.switchTo().window(this.props.handle);

    this.logger.info(`Successfully changed window focus to '${this.props.handle}' window`);
  }
}
