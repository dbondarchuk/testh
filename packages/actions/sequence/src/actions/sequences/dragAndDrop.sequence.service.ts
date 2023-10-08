import {
  Constructor,
  IState,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Actions } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';
import { Coordinates } from './move.sequence.service';

/** Properties for moving mouse button sequence */
export class DragAndDropSequenceActionProperties
  implements ISequenceActionProperties
{
  /** Element to drag */
  @ToSelectorOrElement()
  element: SelectorOrElement;

  /**
   * Element where to drop the {@link element}
   * This will take priority over {@link coordinates} for drop reference
   */
  @ToSelectorOrElement()
  to?: SelectorOrElement;

  /**
   * Coordinates offset where to drop the {@link element}
   */
  coordinates?: Coordinates;
}

/**
 * Convenience function for performing a 'drag and drop' manuever.
 * The target element may be moved to the location of another element, or by an offset (in pixels).
 */
export class DragAndDropSequenceAction
  implements ISequenceAction<DragAndDropSequenceActionProperties>
{
  get type(): string {
    return 'drag-and-drop';
  }

  get propsType(): Constructor<DragAndDropSequenceActionProperties> {
    return DragAndDropSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    state: IState,
    props: DragAndDropSequenceActionProperties,
  ): Promise<Actions> {
    return sequence.dragAndDrop(
      await props.element.getElement(state.currentDriver),
      props.to
        ? await props.to.getElement(state.currentDriver)
        : props.coordinates,
    );
  }
}
