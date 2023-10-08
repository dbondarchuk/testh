import {
  Extension,
  ExtensionTypes,
  IExtension,
  Priorities,
  Service,
} from '@testh/sdk';
import { BrowserInstanceFactoryInjectionToken } from '@testh/actions-browser';
import { FirefoxBrowserInstanceFactory } from './firefox.brower';

import { version } from '../../package.json';

/** Registers chrome browser driver */
@Extension()
export class FirefoxBrowserExtension extends IExtension {
  async init(): Promise<void> {
    Service(BrowserInstanceFactoryInjectionToken)(
      FirefoxBrowserInstanceFactory,
    );
  }

  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Firefox browser';
  }

  get version(): string {
    return version;
  }

  get priority(): number {
    return Priorities.builtIn;
  }
}
