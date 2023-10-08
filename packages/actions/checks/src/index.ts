import {
  Extension,
  ExtensionTypes,
  IExtension,
  loadAsync,
  Priorities,
} from '@testh/sdk';
import { join } from 'path';

import { version } from '../package.json';

/** Registers default actions related to checks */
@Extension()
export class CheckActionsExtension extends IExtension {
  async init(): Promise<void> {
    await loadAsync('.action.js', join(__dirname, 'actions'));
  }

  get type(): string {
    return ExtensionTypes.ServiceProvider;
  }

  get name(): string {
    return 'Built in check actions';
  }

  get version(): string {
    return version;
  }

  get priority(): number {
    return Priorities.builtIn;
  }
}
