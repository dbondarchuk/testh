import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

/** Provides default services implementations with low priority */
@Extension()
export class DefaultServicesProviderLowPriorityExtension extends IExtension {
  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Default Low Priority Services';
  }

  get priority(): number {
    return Priorities.lowest;
  }

  async init(): Promise<void> {
    await loadAsync('.service.low.js', join(__dirname, '..'));
  }
}
