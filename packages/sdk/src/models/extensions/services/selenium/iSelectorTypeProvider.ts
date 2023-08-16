import { By } from 'selenium-webdriver';

/** Provides additional types for {@link Selector} */
export interface ISelectorTypeProvider {
  /** Gets a type to which this provider responds */
  get type(): string;

  /**
   * Parses value and returns Selenium's {@link By}
   * @param value Value to parse
   * @returns {By} Selenium's {@link By}
   */
  by(value: string): By;
}

/** Injection token for the selector type provider */
export const SelectorTypeProviderInjectionToken = 'SelectorTypeProvider';
