import { By } from 'selenium-webdriver';
import { InvalidSelectorTypeException } from '../exceptions/invalidSelectorTypeException';

/**
 * Describes a selector
 */
export class Selector {
  /**
   * Type of the Selector
   */
  public type: string;

  /**
   * Selector value
   */
  public value: string;

  /**
   * Gets selenium By object
   */
  public get by(): By {
    switch (this.type) {
      case 'xpath':
        return By.xpath(this.value);

      case 'css':
        return By.css(this.value);

      case 'id':
        return By.id(this.value);

      case 'class':
        return By.className(this.value);

      case 'name':
        return By.name(this.value);

      /*  Only xpath allows text based search */
      case 'text':
        return By.xpath(`//*[contains(text(), '${this.value}')]`);

      default:
        throw new InvalidSelectorTypeException(this.type);
    }
  }

  toString(): string {
    return `type=${this.type},value=${this.value}`;
  }
}
