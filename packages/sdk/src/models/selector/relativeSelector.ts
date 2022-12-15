import { Type } from 'class-transformer';
import { WebElement } from 'selenium-webdriver';
import { Ignore } from '../../helpers/types/ignore';
import { Selector } from './selector';

/**
 * Type for the relative selector
 * @see https://www.selenium.dev/documentation/webdriver/elements/locators/#relative-locators
 */
export type RelativeType = 'above' | 'below' | 'left' | 'right' | 'near';

/** Describes an instruction for selecting element relatively */
export class RelativeSelector {
  /** Type of the relativity */
  public type: RelativeType;

  /** Selector of the original element */
  @Type(() => Selector)
  public to?: Selector;

  /** 
   * Original element.
   * We can't use {@link SelectorOrElement} here because it will cause a circular dependency
   */
  @Ignore()
  public element?: WebElement;
}
