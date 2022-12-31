import { Extension, IActionExtension, loadAsync } from '@testh/sdk';
import { join } from 'path';

/** Generates a test from the yaml file */
@Extension()
export class BuiltInActionsExtension extends IActionExtension {
  async init(): Promise<void> {
    await loadAsync('.action.js', join(__dirname, '..', '..', 'actions'));
  }

  get name(): string {
    return 'Built in actions';
  }

  get priority(): number {
    return 5;
  }
}
