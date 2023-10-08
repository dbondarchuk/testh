import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link SwitchToBrowserByIndexAction}
 */
export class SwitchToBrowserByIndexActionProperties
  implements IActionProperties
{
  /**
   * Zero-based index of the all opened browser during the current test execution
   * If the value is negative, then indexing will start from the end. I.E. value of `-1` will switch to the last opened browser
   */
  @BindingProperty()
  index: number;
}

/** Action type aliases for {@link SwitchToBrowserByIndexAction} */
export const SwitchToBrowserByIndexActionTypeAliases = [
  'switch-browser',
] as const;

/**
 * Switches to another opened browser session (i.e using Open Browser action) using zero-based index
 * @properties {@link SwitchToBrowserByIndexActionProperties}
 * @runnerType {@link SwitchToBrowserByIndexActionTypeAliases}
 */
@Action(
  SwitchToBrowserByIndexActionProperties,
  'Switch to browser by index',
  ...SwitchToBrowserByIndexActionTypeAliases,
)
export class SwitchToBrowserByIndexAction extends IAction<SwitchToBrowserByIndexActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToBrowserByIndexActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToBrowserByIndexAction>(
      SwitchToBrowserByIndexAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const count = state.driversCount;
    const index =
      this.props.index >= 0 ? this.props.index : count + this.props.index; // using + sign as index will already contain minus sign

    const driver = state.switchToDriver(index);
    const capabilities = await driver.getCapabilities();
    const handle = await driver.getWindowHandle();

    this.logger.info(
      `Successfully changed current browser to '${capabilities.getBrowserName()} v${capabilities.getBrowserVersion()}' with handle '${handle}'`,
    );
  }
}
