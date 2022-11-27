import { WebDriver, WebElement } from "selenium-webdriver";
import { Ignore } from "../../helpers/types/ignore";
import { Selector } from "./selector";

/** Extends selector object to contain reference to an element */
export class SelectorOrElement extends Selector {
    /** Element instance */
    @Ignore()
    public element?: WebElement;

    /**
     * Gets an element instance
     * @param driver Web driver
     * @returns Web element from the property if exist or found by selector and web driver
     */
    async getElement(driver: WebDriver): Promise<WebElement> {
        return this.element ?? await driver.findElement(this.by);
    }
}

/** Extends selector object to contain reference to an array of elements */
export class SelectorOrElements extends Selector {
    /** Elements instances */
    @Ignore()
    public elements?: WebElement[];

    /**
     * Gets an element instance
     * @param driver Web driver
     * @returns Web elements from the property if exist or found by selector and web driver
     */
    async getElements(driver: WebDriver): Promise<WebElement[]> {
        return this.elements ?? await driver.findElements(this.by);
    }
}