import { Constructor, IState } from '@testh/sdk';
import { Actions, Button } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';
import { MouseButton } from './models';
import { MouseButtonToButton } from './press.sequence.service';

/** Properties for mouse button press sequence */
export class ReleaseSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Inserts an action to release a mouse button at the mouse's current location.
   * @default MouseButton.Left Left
   */
  button?: MouseButton;
}

/**
 * Inserts an action to press a mouse button at the mouse's current location.
 */
export class ReleaseSequenceAction
  implements ISequenceAction<ReleaseSequenceActionProperties>
{
  get type(): string {
    return 'release';
  }

  get propsType(): Constructor<ReleaseSequenceActionProperties> {
    return ReleaseSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    _: IState,
    props: ReleaseSequenceActionProperties,
  ): Promise<Actions> {
    const button = props.button
      ? MouseButtonToButton[props.button]
      : Button.LEFT;

    return sequence.release(button);
  }
}
