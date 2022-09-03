import { Type } from "class-transformer";
import { WebElement } from "selenium-webdriver";
import { Selector } from "./selector";

export type RelativeType = 'above' | 'below' | 'left' | 'right' | 'near';

export class RelativeSelector {
  public type: RelativeType;

  @Type(() => Selector)
  public to?: Selector;

  public element?: WebElement;
}
