import { Type } from 'class-transformer';
import { Page } from './page';
import { TestSteps } from './testStep';

/**
 * Describes a test
 */
export class Test {
  /**
   * Name of the test
   */
  name: string;

  /**
   * List of predefined variables
   */
  variables?: Record<string, any>;

  /**
   * Page objects
   */
  @Type(() => Page)
  pages?: Page[];

  /**
   * Steps to run
   */
  steps: TestSteps;
}
