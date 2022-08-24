import { WebDriver } from 'selenium-webdriver';
import { DriverException } from '../exceptions/driverException';
import { Test } from '../tests/test';
import { Variables } from '../tests/variables';

/**
 * Describes a current state of the run
 */
export class TestRunState {
  private readonly _drivers: WebDriver[] = [];
  private readonly _variables: Variables;
  private readonly _testName: string;

  private _currentDriverIndex = -1;

  /**
   * Creates a new instance
   * @param test Test which is been executed
   */
  public constructor(test: Test) {
    this._testName = test.name;
    this._variables = new Variables(test.variables);
  }

  /**
   * Gets test name
   */
  public get testName(): string {
    return this._testName;
  }

  /**
   * Gets variables
   */
  public get variables(): Variables {
    return this._variables;
  }

  /**
   * Gets current driver
   * @throws {DriverException} When no driver was initialized
   * @returns {WebDriver} Current driver
   */
  public get currentDriver(): WebDriver {
    if (this._currentDriverIndex < 0) {
      throw new DriverException('No drivers were initialized.');
    }

    return this._drivers[this._currentDriverIndex];
  }

  /**
   *
   * @param driver Adds a new driver and switches to it
   * @param dontSwitchToNewDriver If true, will not switch to the added driver
   * @returns {WebDriver} The added driver
   */
  public addDriver(
    driver: WebDriver,
    dontSwitchToNewDriver = false,
  ): WebDriver {
    this._drivers.push(driver);

    if (!dontSwitchToNewDriver) {
      this._currentDriverIndex = this._drivers.length - 1;
    }

    return driver;
  }

  /**
   * Gets current driver index
   */
  public get currentDriverIndex(): number {
    return this._currentDriverIndex;
  }

  /**
   * Gets number of drivers
   */
  public get driversCount(): number {
    return this._drivers.length;
  }

  /**
   * Switches to the driver on specified index
   * @param index New driver's index
   * @throws {DriverException} If index is not correct
   * @returns {WebDrive} Driver switched to
   */
  public switchToDriver(index: number): WebDriver {
    if (index < 0 || index >= this.driversCount) {
      throw new DriverException(`Invalid index: ${index}`);
    }

    this._currentDriverIndex = index;

    return this.currentDriver;
  }

  /**
   * Removes the driver on specified index
   * @param index Index of driver to remove
   * @throws {DriverException} If index is not correct
   */
  public async removeDriver(index: number): Promise<void> {
    if (index < 0 || index >= this.driversCount) {
      throw new DriverException(`Invalid index: ${index}`);
    }

    const removed = this._drivers.splice(index, 1);
    await removed[0].close();

    if (this.currentDriverIndex >= this.driversCount) {
      this._currentDriverIndex--;
    }
  }

  /**
   * Closes and removes all drivers
   */
  public async removeAllDrivers(): Promise<void> {
    for (let i = 0; i < this._drivers.length; i++) {
      await this.removeDriver(i);
    }

    this._currentDriverIndex = -1;
  }

  /**
   * Removes the current driver
   */
  public removeCurrentDriver(): void {
    this.removeDriver(this.currentDriverIndex);
  }
}
