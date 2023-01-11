import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

/** Provides default services implementations. Should be executed first */
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

  async init(): Promise<void> {
    await loadAsync('.service.js', join(__dirname, '..'));
  }
}
