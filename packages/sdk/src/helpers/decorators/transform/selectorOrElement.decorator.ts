import { Type } from 'class-transformer';
import {
  SelectorOrElement,
  SelectorOrElements,
} from '../../../models/selector/selectorOrElement';

/**
 * Decorator for transforming to {@link SelectorOrElement}
 */
export function ToSelectorOrElement(): PropertyDecorator {
  return Type(() => SelectorOrElement);
}

/** Decorator for transforming to {@link SelectorOrElements} */
export function ToSelectorOrElements(): PropertyDecorator {
  return Type(() => SelectorOrElements);
}
