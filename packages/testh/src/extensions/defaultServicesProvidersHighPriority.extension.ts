import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

import { version } from '../../package.json';

/** Provides default services implementations with high priority */
@Extension()
export class DefaultServicesProviderHighPriorityExtension extends IExtension {
  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Default High Priority Services';
  }

  get priority(): number {
    return Priorities.high;
  }

  get version(): string {
    return version;
  }

  async init(): Promise<void> {
    await loadAsync('.service.high.js', join(__dirname, '..'));
  }
}
