import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Browser, Builder, logging, WebDriver } from 'selenium-webdriver';
import { ILogger } from '../../models/logger/iLogger';
import { isHeadlessEnvironment } from '../../helpers/configuration/environment';
import { DriverException } from '../../models/exceptions/driverException';
import * as chrome from 'selenium-webdriver/chrome';

/** Mobile emulation using predefined device */
export type MobileEmulationDeviceOptions = {
  /** Name of the predefined device */
  deviceName: string;
};

/** Manual configuration for the mobile emulation */
export type MobileEmulationConfigurableOptions = {
  /** Device width */
  width: number;

  /** Device height */
  height: number;

  /** Device pixel ratio */
  pixelRatio: number;
};

/** Options for mobile emulation */
export type MobileEmulationOptions =
  | MobileEmulationDeviceOptions
  | MobileEmulationConfigurableOptions;

/**
 * Properties for {@link OpenBrowserTestStepRunner}
 */
export class OpenBrowserTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /** Browser type */
  browser: 'chrome' | string;

  /** Determines whether to ignore SSL errors */
  ssl?: boolean;

  /** If set, browser mobile emulation will be used */
  mobileEmulation?: MobileEmulationOptions;

  /** Determines whether to run browser in headless mode */
  headless?: boolean;

  /** Browser locale */
  locale?: string;

  /** Browser window width */
  width?: number;

  /** Browser window height */
  height?: number;
}

/**
 * Runner type aliases
 */
export const OpenBrowserTestStepRunnerTypeAliases = ['open', 'open-browser'] as const;

/**
 * Opens a new browser and switches to its' driver
 * @properties {@link OpenBrowserTestStepRunnerProperties}
 * @runnerType {@link OpenBrowserTestStepRunnerTypeAliases}
 */
@Register(OpenBrowserTestStepRunnerProperties, ...OpenBrowserTestStepRunnerTypeAliases)
export class OpenBrowserTestStepRunner extends ITestStepRunner<OpenBrowserTestStepRunnerProperties> {
  private readonly logger: ILogger;

  constructor(
    props: OpenBrowserTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);

    this.logger = loggerFactory.get<OpenBrowserTestStepRunner>(
      OpenBrowserTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
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
    const builder: Builder = new Builder();

    let isHeadless = this.props.headless;

    let locale = this.props.locale;
    if (!locale) {
      locale = 'default';
    }

    if (isHeadlessEnvironment() && !isHeadless) {
      this.logger.warning(
        'Agent is running in headless environment. Will try to launch headless browsers',
      );
      isHeadless = true;
    }

    const logPrefs: logging.Preferences = new logging.Preferences();
    logPrefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    logPrefs.setLevel(logging.Type.CLIENT, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.DRIVER, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.OFF);
    logPrefs.setLevel(logging.Type.SERVER, logging.Level.OFF);

    if ('chrome' === this.props.browser?.toLowerCase()) {
      require('chromedriver');

      builder.forBrowser(Browser.CHROME);

      const chromeOptions = new chrome.Options();
      chromeOptions.setLoggingPrefs(logPrefs);

      if (isHeadless) {
        chromeOptions.addArguments('--headless');
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-gpu');

        this.logger.info('The browser will be launched in the HEADLESS MODE!');
      }

      if (this.props.ssl) {
        chromeOptions.setAcceptInsecureCerts(true);
        this.logger.info('Accepting Insecure and SSL Certificates');
      }

      const preferences: Record<string, any> = {};

      if (locale?.toLocaleLowerCase() !== 'default') {
        preferences['intl.accept_languages'] = locale;
      }

      if (this.props.mobileEmulation) {
        if (!isHeadless) {
          this.logger.warning(
            'Mobile device emulation is only supported in headless mode',
          );
        } else {
          chromeOptions.setMobileEmulation(this.props.mobileEmulation);
        }
      }

      chromeOptions.addArguments('disable-infobars');
      chromeOptions.setUserPreferences(preferences);

      builder.setChromeOptions(chromeOptions);
    } else {
      throw new DriverException(`Unknown browser: ${this.props.browser}`);
    }

    const driver = builder.build();

    let width = this.props.width;
    let height = this.props.height;

    await driver.getSession();

    if (isHeadless && !this.props.mobileEmulation) {
      if (!width) width = 1920;
      if (!height) height = 1080;

      await this.setScreenSize(driver, width, height);
      const windowSize = await driver.manage().window().getRect();
      this.logger.info(
        `Browser window size - ${windowSize.width}x${windowSize.height}`,
      );
    } else if (!isHeadless && !this.props.mobileEmulation) {
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

    await driver.manage().deleteAllCookies();
    this.logger.info('All Cookies were deleted');

    return driver;
  }

  private async setScreenSize(
    driver: WebDriver,
    width: number,
    height: number,
  ): Promise<void> {
    await driver.manage().window().setRect({ x: 0, y: 0, width, height });
  }

  private async maximizeScreen(driver: WebDriver): Promise<void> {
    // if (Os.getOs().isMac()) {
    //     maximizeScreenWorkaround(driver);
    // } else {
    await driver.manage().window().maximize();
    // }
  }
}
