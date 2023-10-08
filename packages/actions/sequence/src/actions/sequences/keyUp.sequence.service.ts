import { Constructor, IState, UnknownOptionException } from '@testh/sdk';
import { Actions, Key } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';
import { Keys } from './models';

/** Properties for modifier key up sequence */
export class KeyUpSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Keyboard key to release
   * Must be one of {ALT, CONTROL, SHIFT, COMMAND, META}
   */
  key: Keys.ALT | Keys.CONTROL | Keys.SHIFT | Keys.COMMAND | Keys.META;
}

/**
 * Performs a modifier key release. The release is targetted at the currently focused element.
 */
export class KeyUpSequenceAction
  implements ISequenceAction<KeyUpSequenceActionProperties>
{
  get type(): string {
    return 'key-up';
  }

  get propsType(): Constructor<KeyUpSequenceActionProperties> {
    return KeyUpSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    _: IState,
    props: KeyUpSequenceActionProperties,
  ): Promise<Actions> {
    const key = Key[props.key?.toUpperCase()];
    if (!key) {
      throw new UnknownOptionException(`Unknown key: ` + props.key);
    }

    return sequence.keyUp(key);
  }
}
