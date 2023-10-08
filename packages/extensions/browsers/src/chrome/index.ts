import {
  Extension,
  ExtensionTypes,
  IExtension,
  Priorities,
  Service,
} from '@testh/sdk';
import { BrowserInstanceFactoryInjectionToken } from '@testh/actions-browser';
import { ChromeBrowserInstanceFactory } from './chrome.brower';

import { version } from '../../package.json';

/** Registers chrome browser driver */
@Extension()
export class ChromeBrowserExtension extends IExtension {
  async init(): Promise<void> {
    Service(BrowserInstanceFactoryInjectionToken)(ChromeBrowserInstanceFactory);
  }

  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Chrome browser';
  }

  get version(): string {
    return version;
  }

  get priority(): number {
    return Priorities.builtIn;
  }
}
