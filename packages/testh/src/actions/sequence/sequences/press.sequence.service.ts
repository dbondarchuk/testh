import { Constructor, IState } from '@testh/sdk';
import { Actions, Button } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';
import { MouseButton } from './models';

/** Properties for mouse button press sequence */
export class PressSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Inserts an action to press a mouse button at the mouse's current location.
   * @default MouseButton.Left Left
   */
  button?: MouseButton;
}

/** Conversion map from {@link MouseButton} to {@link Button} */
export const MouseButtonToButton: Record<MouseButton, Button> = {
  [MouseButton.Left]: Button.LEFT,
  [MouseButton.Right]: Button.RIGHT,
  [MouseButton.Middle]: Button.MIDDLE,
};

/**
 * Inserts an action to press a mouse button at the mouse's current location.
 */
export class PressSequenceAction
  implements ISequenceAction<PressSequenceActionProperties>
{
  get type(): string {
    return 'press';
  }

  get propsType(): Constructor<PressSequenceActionProperties> {
    return PressSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    _: IState,
    props: PressSequenceActionProperties,
  ): Promise<Actions> {
    const button = props.button
      ? MouseButtonToButton[props.button]
      : Button.LEFT;
    return sequence.press(button);
  }
}
