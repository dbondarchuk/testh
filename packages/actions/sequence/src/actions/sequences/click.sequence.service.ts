import {
  Constructor,
  IState,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Actions } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';

/** Properties for click sequence */
export class ClickSequenceActionProperties
  implements ISequenceActionProperties
{
  /**
   * Optional element to click on.
   * If specified, the mouse will first be moved to the center of the element before performing the click.
   */
  @ToSelectorOrElement()
  element?: SelectorOrElement;
}

/**
 * Short-hand for performing a simple left-click (down/up) with the mouse.
 */
export class ClickSequenceAction
  implements ISequenceAction<ClickSequenceActionProperties>
{
  get type(): string {
    return 'click';
  }

  get propsType(): Constructor<ClickSequenceActionProperties> {
    return ClickSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    state: IState,
    props: ClickSequenceActionProperties,
  ): Promise<Actions> {
    const element = await props.element?.getElement(state.currentDriver);
    return sequence.click(element);
  }
}
