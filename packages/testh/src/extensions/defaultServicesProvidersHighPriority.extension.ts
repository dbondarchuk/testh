import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

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

  async init(): Promise<void> {
    await loadAsync('.service.high.js', join(__dirname, '..'));
  }
}
