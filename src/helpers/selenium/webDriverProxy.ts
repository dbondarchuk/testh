import { plainToClass } from 'class-transformer';
import {
  Locator,
  WebDriver,
  WebElement,
  WebElementPromise,
} from 'selenium-webdriver';
import { Selector } from '../../models/selector/selector';

const transformLocator = (locator: Locator | Selector): Locator => {
  if (locator instanceof Selector) {
    return locator.by;
  }

  if (locator['type'] && locator['value']) {
    const selector = plainToClass(Selector, locator);
    return selector.by;
  }

  return locator;
};

const originalWebDriverFindElement = WebDriver.prototype.findElement;
const originalWebDriverFindElements = WebDriver.prototype.findElements;

WebDriver.prototype.findElement = function (
  locator: Locator | Selector,
): WebElementPromise {
  return originalWebDriverFindElement.call(this, transformLocator(locator));
};

WebDriver.prototype.findElements = function (
  locator: Locator | Selector,
): Promise<WebElement[]> {
  return originalWebDriverFindElements.call(this, transformLocator(locator));
};

const originalWebElementFindElement = WebElement.prototype.findElement;
const originalWebElementFindElements = WebElement.prototype.findElements;

WebElement.prototype.findElement = function (
  locator: Locator | Selector,
): WebElementPromise {
  return originalWebElementFindElement.call(this, transformLocator(locator));
};

WebElement.prototype.findElements = function (
  locator: Locator | Selector,
): Promise<WebElement[]> {
  return originalWebElementFindElements.call(this, transformLocator(locator));
};
