import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

import { version } from '../../package.json';

/** Provides default services implementations. Should be initialized first */
@Extension()
export class DefaultServicesProviderExtension extends IExtension {
  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Default Services';
  }

  get priority(): number {
    return Priorities.builtIn;
  }

  get version(): string {
    return version;
  }

  async init(): Promise<void> {
    await loadAsync('.service.js', join(__dirname, '..'));
  }
}
