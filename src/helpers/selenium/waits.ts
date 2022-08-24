import { Locator, WebDriver } from 'selenium-webdriver';

/**
 * Contains list of methods to work with waits
 */
export class Waits {
  /**
   * Creates a condition to wait for element not to be present in the document
   * @param locator Element locator
   * @returns Fn for WebDriver.wait
   */
  public static untilNotPresent(
    locator: Locator,
  ): (driver: WebDriver) => Promise<boolean> {
    return async (driver: WebDriver) =>
      (await driver.findElements(locator)).length <= 0;
  }
}
