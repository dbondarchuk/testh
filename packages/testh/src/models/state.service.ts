import {
  DriverException,
  IState,
  IStateFactory,
  IVariablesContainer,
  IVariablesContainerFactory,
  Service,
  StateFactoryInjectionToken,
  Test,
  VariablesContainerFactoryInjectionToken,
} from '@testh/sdk';
import { WebDriver } from 'selenium-webdriver';
import { inject } from 'tsyringe';

/**
 * Describes a current state of the run
 */
export class State implements IState {
  private readonly _drivers: WebDriver[] = [];
  private readonly _variables: IVariablesContainer;

  private _currentDriverIndex = -1;

  /**
   * Creates a new instance of State
   * @param test Test to use information
   */
  constructor(
    private readonly _test: Test,
    variablesContainerFactory: IVariablesContainerFactory,
  ) {
    this._variables = variablesContainerFactory.createVariabesContainer(
      this,
      this._test?.variables,
    );
  }

  /**
   * Gets test name
   */
  public get test(): Test {
    return this._test;
  }

  /**
   * Gets variables
   */
  public get variables(): IVariablesContainer {
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
   * Adds a new driver, creates proxy, and switches to it
   * @param driver Driver to add
   * @param dontSwitchToNewDriver If true, will not switch to the added driver
   * @returns {WebDriver} The added driver
   */
  public async addDriver(
    driver: WebDriver,
    dontSwitchToNewDriver = false,
  ): Promise<WebDriver> {
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
   * Gets all opened drivers
   */
  public get drivers(): WebDriver[] {
    return this._drivers;
  }
  
  /**
   * Gets web driver by index
   * @param index Index of the driver
   * @returns {WebDriver} Web driver
   * @returns {undefined} If index is wrong
   */
  public getDriver(index: number): WebDriver | undefined {
    return this._drivers[index];
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

/** Default state factory */
@Service(StateFactoryInjectionToken)
export class StateFactory implements IStateFactory {
  constructor(
    @inject(VariablesContainerFactoryInjectionToken)
    private readonly variablesContainerFactory: IVariablesContainerFactory,
  ) {}

  /** @inheritdoc */
  createState(test: Test): IState {
    return new State(test, this.variablesContainerFactory);
  }
}
