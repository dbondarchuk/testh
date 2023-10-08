import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  IState,
  PropertyIsRequiredException,
} from '@testh/sdk';

/**
 * Properties for {@link SwitchToBrowserByHandleAction}
 */
export class SwitchToBrowserByHandleActionProperties
  implements IActionProperties
{
  /**
   * Handle of the window to search for the browser to switch to
   */
  @BindingProperty()
  handle: string;
}

/** Action type aliases for {@link SwitchToBrowserByHandleAction} */
export const SwitchToBrowserByHandleActionTypeAliases = [
  'switch-browser-by-handle',
] as const;

/**
 * Switches to another opened browser session (i.e using Open Browser action) using the provided handle of the window/tab in that session
 * Then switches to window/tab with the provided handle
 * If multiple sessions will have same handle, the first session will be choosen
 * @properties {@link SwitchToBrowserByHandleActionProperties}
 * @runnerType {@link SwitchToBrowserByHandleActionTypeAliases}
 */
@Action(
  SwitchToBrowserByHandleActionProperties,
  'Switch to browser by handle',
  ...SwitchToBrowserByHandleActionTypeAliases,
)
export class SwitchToBrowserByHandleAction extends IAction<SwitchToBrowserByHandleActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToBrowserByHandleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToBrowserByHandleAction>(
      SwitchToBrowserByHandleAction,
    );
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.handle) {
      throw new PropertyIsRequiredException('handle');
    }

    const count = state.driversCount;
    let indexToUse = -1;
    for (let index = 0; index < count; index++) {
      const driver = state.getDriver(index);

      const hanldes = await driver.getAllWindowHandles();
      if (hanldes.indexOf(this.props.handle)) {
        indexToUse = index;
        break;
      }
    }

    if (indexToUse < 0) {
      throw new InvalidOperationException(
        `Can't find a browser session with any window with handle ${this.props.handle}`,
      );
    }

    const driver = state.switchToDriver(indexToUse);
    const capabilities = await driver.getCapabilities();

    await state.currentDriver.switchTo().window(this.props.handle);

    this.logger.info(
      `Successfully changed current browser to '${capabilities.getBrowserName()} v${capabilities.getBrowserVersion()}' with handle '${
        this.props.handle
      }'`,
    );
  }
}
