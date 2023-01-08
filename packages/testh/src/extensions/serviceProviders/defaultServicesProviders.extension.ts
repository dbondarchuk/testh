import {
  Extension,
  IServiceProviderExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

/** Provides default services implementations. Should be executed first */
@Extension()
export class DefaultServicesProviderExtension extends IServiceProviderExtension {
  get name(): string {
    return 'Default Services';
  }

  get priority(): number {
    return Priorities.lowest - 1;
  }

  async init(): Promise<void> {
    await loadAsync('.service.js', join(__dirname, '..', '..'));
  }
}
