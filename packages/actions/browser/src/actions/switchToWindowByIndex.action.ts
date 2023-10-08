import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link SwitchToWindowByIndexAction}
 */
export class SwitchToWindowByIndexActionProperties
  implements IActionProperties
{
  /**
   * Zero-based index of the all windows in the current browser session
   * If the value is negative, then indexing will start from the end. I.E. value of `-1` will switch to the last open tab/window
   */
  @BindingProperty()
  index: number;
}

/** Action type aliases for {@link SwitchToWindowByIndexAction} */
export const SwitchToWindowByIndexActionTypeAliases = [
  'switch-by-index',
] as const;

/**
 * Switches to another window (tab) using it's index
 * Could be useful to switch to the tab that was opened by clicking on link with `target="_blank"` by setting {@link SwitchToWindowByIndexActionProperties.index} to `-1`
 * @properties {@link SwitchToWindowByIndexActionProperties}
 * @runnerType {@link SwitchToWindowByIndexActionTypeAliases}
 */
@Action(
  SwitchToWindowByIndexActionProperties,
  'Switch to window by index',
  ...SwitchToWindowByIndexActionTypeAliases,
)
export class SwitchToWindowByIndexAction extends IAction<SwitchToWindowByIndexActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToWindowByIndexActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToWindowByIndexAction>(
      SwitchToWindowByIndexAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const allHandles = await state.currentDriver.getAllWindowHandles();
    const index =
      this.props.index >= 0
        ? this.props.index
        : allHandles.length + this.props.index; // using + sign as index will already contain minus sign

    const handle = allHandles[index];
    if (!handle) {
      throw new InvalidOperationException(
        `Can't get a handle for the window with index '${this.props.index}'`,
      );
    }

    await state.currentDriver.switchTo().window(handle);

    this.logger.info(`Successfully changed window focus to '${handle}' window`);
  }
}
