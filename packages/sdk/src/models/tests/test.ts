import { RecordType } from '../../helpers/decorators/transform/recordType.decorator';
import { Page } from './page';
import { Shortcut } from './shortcut';
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
   * Shortcuts
   */
  shortcuts?: Shortcut[];

  /**
   * Steps to run
   */
  steps: TestSteps;
}

/** Injection token for the instance of Test */
export const TestInstanceInjectionToken = Test;
