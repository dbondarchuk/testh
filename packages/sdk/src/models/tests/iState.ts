import { WebDriver } from 'selenium-webdriver';
import { IVariablesContainer } from '../variables/variablesContainer';

/**
 * Describes a current state of the run
 */
export interface IState {
  /** Gets current test name */
  get testName(): string;

  /** Gets variables */
  get variables(): IVariablesContainer;

  /**
   * Gets current driver
   * @throws {DriverException} When no driver was initialized
   * @returns {WebDriver} Current driver
   */
  get currentDriver(): WebDriver;

  /**
   * Adds a new driver, creates proxy, and switches to it
   * @param driver Driver to add
   * @param dontSwitchToNewDriver If true, will not switch to the added driver
   * @returns {WebDriver} The added driver
   */
  addDriver(
    driver: WebDriver,
    dontSwitchToNewDriver?: boolean,
  ): Promise<WebDriver>;

  /**
   * Gets current driver index
   */
  get currentDriverIndex(): number;

  /**
   * Gets number of drivers
   */
  get driversCount(): number;

  /**
   * Switches to the driver on specified index
   * @param index New driver's index
   * @throws {DriverException} If index is not correct
   * @returns {WebDrive} Driver switched to
   */
  switchToDriver(index: number): WebDriver;

  /**
   * Removes the driver on specified index
   * @param index Index of driver to remove
   * @throws {DriverException} If index is not correct
   */
  removeDriver(index: number): Promise<void>;

  /**
   * Closes and removes all drivers
   */
  removeAllDrivers(): Promise<void>;

  /**
   * Removes the current driver
   */
  removeCurrentDriver(): void;
}
