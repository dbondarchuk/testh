import { Constructor, IState, UnknownOptionException } from '@testh/sdk';
import { Actions, Key } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';
import { Keys } from './models';

/** Properties for modifier key down sequence */
export class KeyDownSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Keyboard key to press down
   * Must be one of {ALT, CONTROL, SHIFT, COMMAND, META}
   */
  key: Keys.ALT | Keys.CONTROL | Keys.SHIFT | Keys.COMMAND | Keys.META;
}

/**
 * Presses modifier key on the focused element
 * Key is not releases until {@link KeyUpSequenceAction} or {@link SendKeysSequenceAction} is called with the same key
 */
export class KeyDownSequenceAction
  implements ISequenceAction<KeyDownSequenceActionProperties>
{
  get type(): string {
    return 'key-down';
  }

  get propsType(): Constructor<KeyDownSequenceActionProperties> {
    return KeyDownSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    _: IState,
    props: KeyDownSequenceActionProperties,
  ): Promise<Actions> {
    const key = Key[props.key?.toUpperCase()];
    if (!key) {
      throw new UnknownOptionException(`Unknown key: ` + props.key);
    }

    return sequence.keyDown(key);
  }
}
