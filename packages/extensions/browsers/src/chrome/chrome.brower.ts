import * as chrome from 'selenium-webdriver/chrome';
import { Browser, Builder, logging } from 'selenium-webdriver';
import {
  BaseBrowserInstanceFactory,
  BaseBrowserActionProperties,
  BaseBrowserInstanceFactoryBuilder,
} from '@testh/actions-browser';
import {
  ILoggerFactory,
  LoggerFactoryInjectionToken,
  dependency,
} from '@testh/sdk';
import { ChromeMobileEmulationOptions } from './mobileEmulation';

/**
 * Properties for the browser action
 */
export class ChromeBrowserActionProperties extends BaseBrowserActionProperties {
  /** If set, browser mobile emulation will be used */
  mobileEmulation?: ChromeMobileEmulationOptions;
}

/** Creates a new instance of Chrome browser  */
export class ChromeBrowserInstanceFactory extends BaseBrowserInstanceFactory<ChromeBrowserActionProperties> {
  public constructor(
    @dependency(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    const logger = loggerFactory.get<ChromeBrowserInstanceFactory>(
      ChromeBrowserInstanceFactory,
    );

    super(logger);
  }

  protected async getBuilder(
    logPrefs: logging.Preferences,
    props: ChromeBrowserActionProperties,
  ): Promise<BaseBrowserInstanceFactoryBuilder> {
    const builder = new Builder();

    builder.forBrowser(Browser.CHROME);

    const chromeOptions = new chrome.Options();
    chromeOptions.setLoggingPrefs(logPrefs);

    if (props.headless) {
      chromeOptions.addArguments('--headless');
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-gpu');

      this.logger.info('The browser will be launched in the HEADLESS MODE!');
    }

    if (props.ssl) {
      chromeOptions.setAcceptInsecureCerts(true);
      this.logger.info('Accepting Insecure and SSL Certificates');
    }

    const preferences: Record<string, any> = {};

    if (props.locale?.toLocaleLowerCase() !== 'default') {
      preferences['intl.accept_languages'] = props.locale;
    }

    if (props.mobileEmulation) {
      chromeOptions.setMobileEmulation(props.mobileEmulation);
    }

    chromeOptions.excludeSwitches(
      'disable-popup-blocking',
      'enable-automation',
    );

    if (props.userAgent) {
      chromeOptions.addArguments(`user-agent=${props.userAgent}`);
    }

    chromeOptions.setUserPreferences(preferences);

    builder.setChromeOptions(chromeOptions);

    return {
      builder,
      skipResize: !!props.mobileEmulation,
    };
  }

  public get type(): string {
    return 'chrome';
  }
}
