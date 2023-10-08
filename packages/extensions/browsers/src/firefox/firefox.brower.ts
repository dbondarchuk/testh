import * as firefox from 'selenium-webdriver/firefox';
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

/**
 * Properties for the browser action
 */
export class FirefoxBrowserActionProperties extends BaseBrowserActionProperties {}

export class FirefoxBrowserInstanceFactory extends BaseBrowserInstanceFactory<FirefoxBrowserActionProperties> {
  public constructor(
    @dependency(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    const logger = loggerFactory.get<FirefoxBrowserInstanceFactory>(
      FirefoxBrowserInstanceFactory,
    );

    super(logger);
  }

  protected async getBuilder(
    logPrefs: logging.Preferences,
    props: FirefoxBrowserActionProperties,
  ): Promise<BaseBrowserInstanceFactoryBuilder> {
    const builder = new Builder();

    builder.forBrowser(Browser.FIREFOX);

    const firefoxOptions = new firefox.Options();
    firefoxOptions.setLoggingPrefs(logPrefs);

    if (props.headless) {
      firefoxOptions.addArguments('--headless');
      firefoxOptions.addArguments('--no-sandbox');
      firefoxOptions.addArguments('--disable-gpu');

      this.logger.info('The browser will be launched in the HEADLESS MODE!');
    }

    if (props.ssl) {
      firefoxOptions.setAcceptInsecureCerts(true);
      this.logger.info('Accepting Insecure and SSL Certificates');
    }

    if (props.locale?.toLocaleLowerCase() !== 'default') {
      firefoxOptions.setPreference('intl.accept_languages', props.locale);
    }

    if (props.userAgent) {
      firefoxOptions.setPreference(
        'general.useragent.override',
        props.userAgent,
      );
    }

    builder.setFirefoxOptions(firefoxOptions);

    return {
      builder,
      skipResize: false,
    };
  }

  public get type(): string {
    return 'firefox';
  }
}
