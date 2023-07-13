import {
  Constructor,
  IState,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Actions } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';

/** Properties for double click sequence */
export class RightClickSequenceActionProperties
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
 * Short-hand for performing a simple rightt-click (down/up) with the mouse.
 */
export class RightClickSequenceAction
  implements ISequenceAction<RightClickSequenceActionProperties>
{
  get type(): string {
    return 'right-click';
  }

  get propsType(): Constructor<RightClickSequenceActionProperties> {
    return RightClickSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    state: IState,
    props: RightClickSequenceActionProperties,
  ): Promise<Actions> {
    const element = await props.element?.getElement(state.currentDriver);
    return sequence.contextClick(element);
  }
}
