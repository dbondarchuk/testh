import { RecordType } from '../../helpers/types/recordType';
import { Page } from './page';
import { TestSteps } from './testSteps';

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
  @RecordType(Page)
  pages?: Record<string, Page>;

  /**
   * Steps to run
   */
  steps: TestSteps;
}

/** Injection token for the instance of Test */
export const TestInstanceInjectionToken = Test;
