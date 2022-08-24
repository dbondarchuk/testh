import { TestStep } from './testStep';

/**
 * Describes a test
 */
export interface Test {
  /**
   * Name of the test
   */
  name: string;

  /**
   * List of predefined variables
   */
  variables?: Record<string, any>;

  /**
   * Steps to run
   */
  steps: TestStep[];
}
