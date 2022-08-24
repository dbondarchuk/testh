import { Selector } from '../selector/selector';

/**
 * Describes an error on not found element
 */
export class ElementNotFoundException extends Error {
  /**
   * Creates a new instance
   * @param selector Element selector
   */
  constructor(selector: Selector) {
    super(`Element ${selector} was not found`);
  }
}
