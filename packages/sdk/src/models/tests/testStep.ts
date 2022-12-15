/**
 * Describes a test step value
 */
export interface TestStep {
  /**
   * Type of the test
   */
  type: string;

  /**
   * Is this test step disabled
   */
  disabled?: boolean;

  /**
   * Should this step run even when test is already failed
   */
  runOnFailure?: boolean;

  /**
   * Should error produced by this step ignored
   */
  ignoreError?: boolean;

  /**
   * Boolean JS condition to determine if step should be run
   */
  condition?: string;

  /**
   *  Name of this step
   */
  name: string;

  /**
   * Values of the step properties
   */
  values: Record<string, any>;
}
