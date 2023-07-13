import {
  Constructor,
  IState,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Actions } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';

/** Properties for double click sequence */
export class DoubleClickSequenceActionProperties
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
 * Short-hand for performing a simple double left-click (down/up) with the mouse.
 */
export class DoubleClickSequenceAction
  implements ISequenceAction<DoubleClickSequenceActionProperties>
{
  get type(): string {
    return 'double-click';
  }

  get propsType(): Constructor<DoubleClickSequenceActionProperties> {
    return DoubleClickSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    state: IState,
    props: DoubleClickSequenceActionProperties,
  ): Promise<Actions> {
    const element = await props.element?.getElement(state.currentDriver);
    return sequence.doubleClick(element);
  }
}
