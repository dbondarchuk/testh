import { Constructor, IState } from '@testh/sdk';
import { Actions } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';

/** Properties for modifier key down sequence */
export class SendKeysSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Text to send
   */
  text: string;
}

/**
 * Sends simulated typed text into the focused element
 */
export class SendKeysSequenceAction
  implements ISequenceAction<SendKeysSequenceActionProperties>
{
  get type(): string {
    return 'send-keys';
  }

  get propsType(): Constructor<SendKeysSequenceActionProperties> {
    return SendKeysSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    _: IState,
    props: SendKeysSequenceActionProperties,
  ): Promise<Actions> {
    return sequence.sendKeys(props.text);
  }
}
