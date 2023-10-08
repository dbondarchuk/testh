import {
  Extension,
  ExtensionTypes,
  IExtension,
  Priorities,
  Service,
} from '@testh/sdk';
import { BrowserInstanceFactoryInjectionToken } from '@testh/actions-browser';
import { EdgeBrowserInstanceFactory } from './edge.brower';

import { version } from '../../package.json';

/** Registers chrome browser driver */
@Extension()
export class EdgeBrowserExtension extends IExtension {
  async init(): Promise<void> {
    Service(BrowserInstanceFactoryInjectionToken)(EdgeBrowserInstanceFactory);
  }

  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Edge browser';
  }

  get version(): string {
    return version;
  }

  get priority(): number {
    return Priorities.builtIn;
  }
}
