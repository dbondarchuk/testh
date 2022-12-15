import { Type } from 'class-transformer';
import { By, locateWith, RelativeBy } from 'selenium-webdriver';
import { InvalidSelectorTypeException } from '../exceptions/invalidSelectorTypeException';
import { RelativeSelector } from './relativeSelector';

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

  @Type(() => RelativeSelector)
  public relative?: RelativeSelector[];

  /**
   * Gets selenium By object
   */
  public get by(): By | RelativeBy {
    let by: By;
    switch (this.type) {
      case 'xpath':
        by = By.xpath(this.value);
        break;

      case 'css':
        by = By.css(this.value);
        break;

      case 'id':
        by = By.id(this.value);
        break;

      case 'class':
        by = By.className(this.value);
        break;

      case 'name':
        by = By.name(this.value);
        break;

      /*  Only xpath allows text based search */
      case 'text':
        by = By.xpath(`//*[contains(text(), '${this.value}')]`);
        break;

      default:
        throw new InvalidSelectorTypeException(this.type);
    }

    if (!this.relative || this.relative.length == 0) {
      return by;
    }

    const relative = this.relative.reduce((relativeBy, item) => {
      switch (item.type) {
        case 'above':
          return relativeBy.above(item.element ?? item.to.by);
        case 'below':
          return relativeBy.below(item.element ?? item.to.by);
        case 'left':
          return relativeBy.toLeftOf(item.element ?? item.to.by);
        case 'right':
          return relativeBy.toRightOf(item.element ?? item.to.by);
        case 'near':
          return relativeBy.near(item.element ?? item.to.by);
        default:
          throw new InvalidSelectorTypeException(
            `Unknown relative selector type: ${item.type}`,
          );
      }
    }, locateWith(by));

    return relative;
  }

  toString(): string {
    return `type=${this.type},value=${this.value},relative=${
      this.relative ? JSON.stringify(this.relative) : 'none'
    }`;
  }
}
