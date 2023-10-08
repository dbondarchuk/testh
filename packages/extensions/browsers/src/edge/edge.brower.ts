import * as edge from 'selenium-webdriver/edge';
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
import { ChromeMobileEmulationOptions } from '../chrome/mobileEmulation';

/**
 * Properties for the browser action
 */
export class EdgeBrowserActionProperties extends BaseBrowserActionProperties {
  /** If set, browser mobile emulation will be used */
  mobileEmulation?: ChromeMobileEmulationOptions;
}

export class EdgeBrowserInstanceFactory extends BaseBrowserInstanceFactory<EdgeBrowserActionProperties> {
  public constructor(
    @dependency(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    const logger = loggerFactory.get<EdgeBrowserInstanceFactory>(
      EdgeBrowserInstanceFactory,
    );

    super(logger);
  }

  protected async getBuilder(
    logPrefs: logging.Preferences,
    props: EdgeBrowserActionProperties,
  ): Promise<BaseBrowserInstanceFactoryBuilder> {
    const builder = new Builder();

    builder.forBrowser(Browser.EDGE);

    const edgeOptions = new edge.Options();
    edgeOptions.setLoggingPrefs(logPrefs);

    if (props.headless) {
      edgeOptions.addArguments('--headless');
      edgeOptions.addArguments('--no-sandbox');
      edgeOptions.addArguments('--disable-gpu');

      this.logger.info('The browser will be launched in the HEADLESS MODE!');
    }

    if (props.ssl) {
      edgeOptions.setAcceptInsecureCerts(true);
      this.logger.info('Accepting Insecure and SSL Certificates');
    }

    const preferences: Record<string, any> = {};

    if (props.locale?.toLocaleLowerCase() !== 'default') {
      preferences['intl.accept_languages'] = props.locale;
    }

    if (props.mobileEmulation) {
      edgeOptions.setMobileEmulation(props.mobileEmulation);
    }

    edgeOptions.excludeSwitches('disable-popup-blocking', 'enable-automation');

    if (props.userAgent) {
      edgeOptions.addArguments(`user-agent=${props.userAgent}`);
    }

    edgeOptions.setUserPreferences(preferences);

    builder.setEdgeOptions(edgeOptions);

    return {
      builder,
      skipResize: !!props.mobileEmulation,
    };
  }

  public get type(): string {
    return 'edge';
  }
}
