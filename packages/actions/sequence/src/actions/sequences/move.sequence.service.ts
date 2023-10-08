import {
  Constructor,
  IState,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Actions, Origin } from 'selenium-webdriver';
import { ISequenceAction, ISequenceActionProperties } from '../sequence.action';

/** Coordinates */
export interface Coordinates {
  /** X coordinate */
  x?: number;

  /** Y coordinate */
  y?: number;
}

/** Properties for moving mouse button sequence */
export class MoveSequenceActionProperties implements ISequenceActionProperties {
  /**
   * Coordinates to move to
   */
  coordinates?: Coordinates;

  /**
   * Duration for the move
   */
  duration?: number;

  /**
   * Origin to calculate offset from
   */
  origin?: Origin;

  /**
   * Origin element to calculate offset from.
   * Takes precedence over {@link origin}
   */
  @ToSelectorOrElement()
  originElement?: SelectorOrElement;
}

/**
 * Inserts an action to move a mouse in specific direction.
 */
export class MoveSequenceAction
  implements ISequenceAction<MoveSequenceActionProperties>
{
  get type(): string {
    return 'move';
  }

  get propsType(): Constructor<MoveSequenceActionProperties> {
    return MoveSequenceActionProperties;
  }

  async execute(
    sequence: Actions,
    state: IState,
    props: MoveSequenceActionProperties,
  ): Promise<Actions> {
    return sequence.move({
      x: props.coordinates?.x,
      y: props.coordinates?.y,
      duration: props.duration,
      origin: props.originElement
        ? await props.originElement.getElement(state.currentDriver)
        : props.origin,
    });
  }
}
