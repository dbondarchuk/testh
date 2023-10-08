import {
  Action,
  BindingProperty,
  DriverException,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  isHeadlessEnvironment,
  IState,
  resolveAll,
  ToBoolean,
  ToNumber,
} from '@testh/sdk';
import { Builder, logging, WebDriver } from 'selenium-webdriver';

/** Descibes a services that creates an instance of the webdriver (browser) */
export interface IBrowserInstanceFactory<
  T extends BaseBrowserActionProperties,
> {
  /**
   * Creates a web driver instance
   * @param props Props from {@link OpenBrowserAction}
   * @returns WebDriver
   */
  createWebDriverInstance: (props: T) => Promise<WebDriver>;

  /**
   * Gets browser type (name)
   * @example chrome, edge, firefox
   */
  get type(): string;
}

/** Return type for {@link BaseBrowserInstanceFactory.getBuilder} function */
export type BaseBrowserInstanceFactoryBuilder = {
  /** Web driver builder */
  builder: Builder;

  /** Whether or not we need to skip resizing browser window */
  skipResize: boolean;
};

/** Provides base class for creating a web driver */
export abstract class BaseBrowserInstanceFactory<
  T extends BaseBrowserActionProperties,
> {
  /**
   * Creates new instance
   * @param logger Logger
   */
  protected constructor(protected readonly logger: ILogger) {}

  /**
   * Creates a new web driver instance using a builder provided by inherited implementation.
   * Sets default logging prefernces, locale, headless options.
   * Sets window size or maximizes window otherwise.
   * @param props Props from {@link OpenBrowserAction}
   * @returns Web driver
   */
  public async createWebDriverInstance(props: T): Promise<WebDriver> {
    props.headless = props.headless !== false;

    if (!props.locale) {
      props.locale = 'default';
    }

    if (isHeadlessEnvironment() && !props.headless) {
      this.logger.warning(
        'Agent is running in headless environment. Will try to launch headless browsers',
      );
      props.headless = true;
    }

    const logPrefs: logging.Preferences = new logging.Preferences();
    logPrefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    logPrefs.setLevel(logging.Type.CLIENT, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.DRIVER, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.SERVER, logging.Level.OFF);

    const { builder, skipResize } = await this.getBuilder(logPrefs, props);
    const driver = builder.build();

    let width = props.width;
    let height = props.height;

    await driver.getSession();

    if (!skipResize) {
      if (props.headless) {
        if (!width) width = 1920;
        if (!height) height = 1080;

        await this.setScreenSize(driver, width, height);
        const windowSize = await driver.manage().window().getRect();
        this.logger.info(
          `Browser window size - ${windowSize.width}x${windowSize.height}`,
        );
      } else {
        if (!!width && !!height) {
          await this.setScreenSize(driver, width, height);
          const windowSize = await driver.manage().window().getRect();

          this.logger.info(
            `Browser window size was set! Window size - ${windowSize.width}x${windowSize.height}`,
          );
        } else {
          await this.maximizeScreen(driver);
          const windowSize = await driver.manage().window().getRect();

          this.logger.info(
            `Browser window is maximized! Window size - ${windowSize.width}x${windowSize.height}`,
          );
        }
      }
    }

    await driver.manage().deleteAllCookies();
    this.logger.info('All Cookies were deleted');

    return driver;
  }

  /** @inheritdoc */
  public abstract type: string;

  /**
   * Overridable function to get a web driver builder
   * @param logPrefs Logging preferences
   * @param props Props from {@link OpenBrowserAction}
   */
  protected abstract getBuilder(
    logPrefs: logging.Preferences,
    props: T,
  ): Promise<BaseBrowserInstanceFactoryBuilder>;

  /**
   * Sets browser window screen size
   * @param driver Web driver
   * @param width New window width
   * @param height New window height
   */
  protected async setScreenSize(
    driver: WebDriver,
    width: number,
    height: number,
  ): Promise<void> {
    await driver.manage().window().setRect({ x: 0, y: 0, width, height });
  }

  /**
   * Maximizes browser window
   * @param driver Web driver
   */
  protected async maximizeScreen(driver: WebDriver): Promise<void> {
    // if (Os.getOs().isMac()) {
    //     maximizeScreenWorkaround(driver);
    // } else {
    await driver.manage().window().maximize();
    // }
  }
}

export const BrowserInstanceFactoryInjectionToken = 'BrowserInstanceFactory';

/**
 * Base properties for {@link OpenBrowserAction}
 */
export class BaseBrowserActionProperties implements IActionProperties {
  /** Determines whether to ignore SSL errors */
  @ToBoolean()
  ssl?: boolean;

  /**
   * Determines whether to run browser in headless mode
   * @defaultValue true
   */
  @ToBoolean()
  headless?: boolean;

  /** Browser locale */
  locale?: string;

  /** Browser window width */
  @ToNumber()
  width?: number;

  /** Browser window height */
  @ToBoolean()
  height?: number;

  /** Change browser's user agent */
  userAgent?: string;
}

/**
 * Properties for {@link OpenBrowserAction}
 */
export class OpenBrowserActionProperties extends BaseBrowserActionProperties {
  /** Browser type */
  @BindingProperty()
  browser: string;
}

/**
 * Action type aliases
 */
export const OpenBrowserActionTypeAliases = ['open', 'open-browser'] as const;

/**
 * Opens a new browser and switches to its' driver
 * @properties {@link OpenBrowserActionProperties}
 * @runnerType {@link OpenBrowserActionTypeAliases}
 */
@Action(
  OpenBrowserActionProperties,
  'Open browser',
  ...OpenBrowserActionTypeAliases,
)
export class OpenBrowserAction extends IAction<OpenBrowserActionProperties> {
  private readonly logger: ILogger;

  constructor(
    props: OpenBrowserActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);

    this.logger = loggerFactory.get<OpenBrowserAction>(OpenBrowserAction);
  }

  public async run(state: IState): Promise<void> {
    const driver = await this.createWebDriverInstance();

    await state.addDriver(driver);

    // // Only Chrome can get normal browser logs
    // switch (browser.toLowerCase()){
    //     case "chrome":
    //     case "opera":
    //         (new BrowserConsoleListener(driver, currentState, logger)).start();
    //         break;

    //     default:
    //         (new BrowserFallbackConsoleListener(driver, currentState, logger)).start();
    //         break;
    // }

    // (new BrowserLoadJsVariablesListener(driver, currentState, logger)).start();
    // (new BrowserLoadTimeListener(driver, currentState, logger)).start();

    this.logger.info(`Browser ${this.props.browser} was successfully opened`);
  }

  private async createWebDriverInstance(): Promise<WebDriver> {
    const browserFactories = resolveAll<IBrowserInstanceFactory<any>>(
      BrowserInstanceFactoryInjectionToken,
    );

    for (const factory of browserFactories) {
      if (factory.type !== this.props.browser) continue;

      return await factory.createWebDriverInstance(this.props);
    }

    throw new DriverException(`Unknown browser: ${this.props.browser}`);
  }
}
